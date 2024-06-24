import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getUserByAddress, isUserAdmin } from "../../../prisma/operations/users/read";
import {
  activateProposal,
  publishProposal,
  updateProposal,
} from "../../../prisma/operations/proposals/put";
import { SnapshotGraphQL } from "@/snapshot/graphql/SnapshotGraphQL";
import { spaceName } from "@/snapshot/config";
import { processRequest } from "@/utils/utils";
import { createProposal } from "../../../prisma/operations/proposals/create";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { body } = req;
  const { action, proposalId, title, content, proposalDigest } = body;

  processRequest("POST", req, res, async () => {
    const session = await getServerSession(
      req,
      res,
      await authOptions(req, res)
    );

    if(session) {
      //
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
    }
  });
}
