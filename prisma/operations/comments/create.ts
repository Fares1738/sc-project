import { prisma } from "../../../src/utils/prisma";
import { getProposalById } from "../proposals/read";
import { getUserById } from "../users/read";

export async function createComment({
  userId,
  proposalId,
  content,
}: {
  userId: string;
  proposalId: string;
  content: string;
}) {
  const p = await getProposalById(proposalId);
  if (!p) throw Error("Proposal doesn't exist");
  const u = await getUserById(userId);
  if (!u) throw Error("User doesn't exist");

  return await prisma.comment.create({
    data: {
      authorId: userId,
      proposalId: proposalId,
      content: content,
      createdAt: new Date(),
    },
  });
}
