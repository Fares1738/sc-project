import type { NextApiRequest, NextApiResponse } from "next";
import createUser from "../../../prisma/operations/users/create";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { AdminVotingToken } from "@/AdminVotingToken";
import { isUserAdmin } from "../../../prisma/operations/users/read";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string;
  }>
) {
  const vt = new AdminVotingToken();

  const { method, body } = req;
  const { userType, userAddress, matricNumber, cgpa, fullName } = body;

  async function session() {
    try {
      const session = await getServerSession(
        req,
        res,
        await authOptions(req, res)
      );

      if (session) {
        const _isUserAdmin = await isUserAdmin(session.address);

        if (_isUserAdmin) {
          const castedCgpa = Number((cgpa * 100).toFixed(0));

          const simulation = await vt.simulate("adjust", [
            userAddress,
            castedCgpa,
            userType === "CM" ? 2 : 1,
          ]);

          const result = await createUser({
            userType,
            userAddress,
            matricNumber,
            cgpa: castedCgpa,
            fullName,
          });

          await vt.execute(simulation.request);

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
