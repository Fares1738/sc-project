import { prisma } from "../../../src/utils/prisma";

export default async function deleteComment(commentId: string) {
  const c = await prisma.comment.findFirst({ where: { id: commentId } });
  if (!c) throw Error("comment not found!");

  return await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}
