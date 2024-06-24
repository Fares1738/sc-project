import { prisma } from "../../../src/utils/prisma";

export default async function deleteUser(userId: string) {
  // only delete listing if it's in a draft status
  let result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (result) {
    result = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } else {
    return true;
  }

  return result != null;
}
