import { Proposal } from "@/utils/types";
import { prisma } from "../../../src/utils/prisma";

export async function createProposal({ title, content }: Proposal) {
  return await prisma.proposal.create({
    data: {
      title,
      content,
      status: "Draft",
      likesCount: 0,
      createdAt: new Date(),
    },
  });
}
