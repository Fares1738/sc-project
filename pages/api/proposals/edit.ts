import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getUserByAddress } from "../../../prisma/operations/users/read";
import {
  activateProposal,
  publishProposal,
  updateProposal,
} from "../../../prisma/operations/proposals/put";
import { SnapshotGraphQL } from "@/snapshot/graphql/SnapshotGraphQL";
import { spaceName } from "@/snapshot/config";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method, body } = req;
  const { action, proposalId, title, content, proposalDigest } = body;

  async function session() {
    try {
      const session = await getServerSession(
        req,
        res,
        await authOptions(req, res)
      );

      if (session) {
        const u = await getUserByAddress(session.address);
        if (u && ["ADMIN", "CM"].includes(u.userType)) {
          switch (action) {
            case "updateInfo":
              await updateProposal(proposalId, {
                title,
                content,
              });
              break;
            case "activate":
              if (u.userType !== "ADMIN") {
                return res.status(401).json({ message: "User Not Admin!" });
              }
              await activateProposal(proposalId);
              break;
            case "publish":
              if (u.userType !== "ADMIN") {
                return res.status(401).json({ message: "User Not Admin!" });
              }
              // TODO add extra checking
              const id = proposalDigest.id;
              const ipfs = proposalDigest.ipfs;
              console.log("hash id", id);
              console.log("digest", proposalDigest);
              const snap = new SnapshotGraphQL();
              const proposal = await snap.getProposal(id as string);
              console.log(proposal);
              if (!proposal) throw Error("Proposal not found!");
              if (proposal.space.id !== spaceName)
                throw Error("Invalid space name!");
    
              await publishProposal(proposalId, id, ipfs);
              break;
            default:
              return res
                .status(500)
                .json({ message: "Invalid proposal edit action!" });
          }

          return res.status(200).json({ message: "success" });
        } else {
          return res.status(401).json({ message: "Unauthorized Access!" });
        }
      } else {
        return res.status(401).json({ message: "Invalid Session!" });
      }
    } catch (e) {
      console.log("error", e);
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }

  if (method === "POST") {
    session();
  } else {
    return res.status(405).json({ message: "Method Not Allowed!" });
  }
}
