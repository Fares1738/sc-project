import { prisma } from "../../../src/utils/prisma";

export async function getUserById(id: string) {
  const result = await prisma.user.findFirst({
    where: {
      id,
    },
  });
  return result ?? null;
}

export async function isUserAdmin(addr: string) {
  const res = await prisma.user.findFirst({
    where: {
      userType: "ADMIN",
      userAddress: addr,
    },
  });

  return !!res;
}

export async function getUserByAddress(userAddress: string) {
  const result = await prisma.user.findFirst({
    where: {
      userAddress,
    },
  });
  return result ?? null;
}

export async function getListings(page: number) {
  if (page < 1) throw Error("Invalid page!");
  const result = await prisma.user.findMany({
    take: 4,
    skip: page == 1 ? 0 : (page - 1) * 4,
    orderBy: {
      id: "asc",
    },
  });
  return result ?? null;
}
