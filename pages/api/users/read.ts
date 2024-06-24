import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getUserByAddress } from "../../../prisma/operations/users/read";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string;
    data: Object | null;
  }>
) {
  const { method, query } = req;
  const { userAddress, name } = query;

  const session = await getServerSession(req, res, await authOptions(req, res));

  if (method === "GET") {
    try {
      let user;
      switch (name) {
        case "userType":
          user = await getUserByAddress(userAddress as string);
          return res.status(200).json({
            message: "success",
            data: { userType: user ? user.userType : null },
          });
        case "self":
          if (session?.address)
            user = await getUserByAddress(session?.address as string);
          return res.status(200).json({
            message: "success",
            data: user
              ? { fullName: user.fullName, userType: user.userType }
              : null,
          });
        default:
          throw Error("invalid action!");
      }
    } catch (e) {
      console.log("error", e);
      return res
        .status(500)
        .json({ message: "Something went wrong!", data: {} });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed!", data: {} });
  }
}
