import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { createProposal } from "../../../prisma/operations/proposals/create";
import { isUserAdmin } from "../../../prisma/operations/users/read";
import { processRequest } from "@/utils/utils";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string;
  }>
) {
  const { body } = req;
  const { title, content } = body;

  
  processRequest("POST", req, res, async () => {
    const session = await getServerSession(
      req,
      res,
      await authOptions(req, res)
    );

    if(session) {
      const _isUserAdmin = await isUserAdmin(session.address);
      if (_isUserAdmin) {
        const result = await createProposal({ title, content });
        return res.status(200).json({ message: "success" });
      } else {
        return res.status(401).json({ message: "Unauthorized Access!" });
      }
    }
  });
}
