import type { NextApiRequest, NextApiResponse } from "next";
import nextAuth, { AuthOptions } from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { ethers } from "ethers";
import type { SIWESession } from "@web3modal/siwe";
import {
  getUserByAddress,
  isUserAdmin,
} from "../../../prisma/operations/users/read";

declare module "next-auth" {
  interface Session extends SIWESession {
    address: string;
    chainId: number;
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const _authOptions = await authOptions(req, res);
  return await nextAuth(req, res, _authOptions);
}

export const authOptions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const nextAuthSecret = process.env["NEXTAUTH_SECRET"];
  if (!nextAuthSecret) {
    throw new Error("NEXTAUTH_SECRET is not set");
  }
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

  if (!projectId) throw new Error("Missing NEXT_PUBLIC_PROJECT_ID");

  const providers = [
    credentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message) {
            throw new Error("SiweMessage is undefined");
          }
          const siwe = new SiweMessage(credentials.message);

          const addr = siwe.address;
          const _isUserAdmin = await isUserAdmin(addr);

          if (!_isUserAdmin) {
            // TODO query record from blockchain
            const userRecord = await getUserByAddress(addr);
            if (!userRecord) {
              return null;
            }
          }

          const provider = new ethers.JsonRpcProvider(
            `https://rpc.walletconnect.com/v1?chainId=eip155:${siwe.chainId}&projectId=${projectId}`
          );
          const nonce = await getCsrfToken({ req: { headers: req.headers } });
          const result = await siwe.verify(
            {
              signature: credentials?.signature || "",
              nonce,
            },
            { provider }
          );

          if (result.success) {
            return {
              id: `eip155:${siwe.chainId}:${siwe.address}`,
            };
          }

          return null;
        } catch (e) {
          console.log("caught error during auth:", e);
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query?.["nextauth"]?.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return {
    // https://next-auth.js.org/configuration/providers/oauth
    secret: nextAuthSecret,
    providers,
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
      session({ session, token }) {
        if (!token.sub) {
          return session;
        }

        const [, chainId, address] = token.sub.split(":");
        if (chainId && address) {
          session.address = address;
          session.chainId = parseInt(chainId, 10);
        }

        return session;
      },
    },
  } as AuthOptions;
};
