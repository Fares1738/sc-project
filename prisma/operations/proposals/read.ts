import { prisma } from "../../../src/utils/prisma";

export async function getProposalById(id: string) {
  return await prisma.proposal.findFirst({
    where: {
      id,
    },
  });
}

export async function getProposals(
  // page: number
) {
  // if (page < 1) throw Error("Invalid page!");
  const result = await prisma.proposal.findMany({
    // take: 4,
    // skip: page == 1 ? 0 : (page - 1) * 4,
    // orderBy: {
    //   id: "asc",
    // },
  });

  console.log("res", result)
  return result ?? null;
}