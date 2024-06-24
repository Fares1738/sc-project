import { Proposal } from "@/utils/types";
import { prisma } from "../../../src/utils/prisma";
import { getProposalById } from "./read";
import { client } from "@/utils/utils";

export async function processLike(userId: string, proposalId: string) {
  // Check if the user has already liked the proposal
  const existingLike = await prisma.likedProposals.findFirst({
    where: {
      userId,
      proposalId,
    },
  });

  if (existingLike) {
    removeLike(userId, proposalId);
  } else {
    addLike(userId, proposalId);
  }
}

// Add a like to a proposal
async function addLike(userId: string, proposalId: string) {
  // Create a new LikedProposals record
  await prisma.likedProposals.create({
    data: {
      userId,
      proposalId,
    },
  });

  // Update the likes count of the proposal
  await prisma.proposal.update({
    where: {
      id: proposalId,
    },
    data: {
      likesCount: { increment: 1 },
    },
  });
}

export async function getProposalLiked(userId: string, proposalId: string) {
  return await prisma.likedProposals.findFirst({
    where: {
      userId,
      proposalId,
    },
  });
}

// Remove a like from a proposal
async function removeLike(userId: string, proposalId: string) {
  // Find the LikedProposals record
  const likeToDelete = await prisma.likedProposals.findFirst({
    where: {
      userId,
      proposalId,
    },
  });

  if (likeToDelete) {
    // Delete the LikedProposals record
    await prisma.likedProposals.delete({
      where: {
        id: likeToDelete.id,
      },
    });

    // Update the likes count of the proposal
    await prisma.proposal.update({
      where: {
        id: proposalId,
      },
      data: {
        likesCount: { decrement: 1 },
      },
    });
  }
}

export async function updateProposal(
  proposalId: string,
  { title, content }: Proposal
) {
  //

  const p = await getProposalById(proposalId);

  if (!p) throw Error("Proposal doesn't exist!");
  else if (p.status !== "Draft") throw Error("Cannot edit non draft proposal!");

  return await prisma.proposal.update({
    where: {
      id: proposalId,
    },
    data: {
      title,
      content,
    },
  });
}

export async function activateProposal(proposalId: string) {
  const p = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
    },
  });

  if (!p) throw Error("Proposal not found!");

  if (p.status !== "Draft")
    throw Error(`Proposal is in ${p?.status} status and not Draft!`);

  const lastBlockNumber = await client.getBlockNumber();
  await prisma.proposal.update({
    where: {
      id: proposalId,
    },
    data: {
      blockNumberSnapshot: lastBlockNumber,
      status: "Active",
    },
  });
}

export async function publishProposal(
  proposalId: string,
  proposalHash: string,
  proposalIpfs: string
) {
  const p = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
    },
  });

  if (!p) throw Error("Proposal not found!");

  if (p.status !== "Active")
    throw Error(`Proposal is in ${p?.status} status and not Active!`);

  await prisma.proposal.update({
    where: {
      id: proposalId,
    },
    data: {
      status: "Published",
      proposalIdHash: proposalHash,
      proposalIpfs,
    },
  });
}
