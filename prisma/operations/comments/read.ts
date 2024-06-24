import { prisma } from "../../../src/utils/prisma";

export async function getProposalComments(proposalId: string) {
    return await prisma.comment.findMany({
        where:{
            proposalId
        }
    })
}