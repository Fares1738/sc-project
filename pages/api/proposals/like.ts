import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { processLike } from "../../../prisma/operations/proposals/put";
import { getUserByAddress } from "../../../prisma/operations/users/read";
import { getProposalById } from "../../../prisma/operations/proposals/read";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string;
  }>
) {
  const { method, body } = req;
  const { proposalId } = body;

  async function session() {
    try {
      const session = await getServerSession(
        req,
        res,
        await authOptions(req, res)
      );

      if (session) {
        const address = session.address;
        if (session.address) {
          // validate session address
          const userResult = await getUserByAddress(address);

          if (!userResult)
            return res.status(401).json({ message: "Invalid User!" });

          // validate input
          const proposalResult = await getProposalById(proposalId);

          if (!proposalResult)
            return res.status(401).json({ message: "Invalid Proposal!" });

          await processLike(userResult.id, proposalId);

          return res.status(200).json({ message: "success" });
        } else {
          return res.status(401).json({ message: "Invalid Address!" });
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
