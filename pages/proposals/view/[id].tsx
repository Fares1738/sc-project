// "use client";

import styles from "../../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Proposal } from "@prisma/client";
import { performGET } from "@/utils/httpRequest";
import { getProposalLiked } from "../../../prisma/operations/proposals/put";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getUserByAddress } from "../../../prisma/operations/users/read";
import { getProposalById } from "../../../prisma/operations/proposals/read";
import { isValidObjectId, stringify } from "@/utils/utils";
import { CustomComment } from "@/utils/types";
import ProposalDisplay from "@/components/ProposalDisplay";

export const getServerSideProps = async (ctx: any) => {
  const { params, req, res } = ctx;
  const { id } = params;
  const isValidId = isValidObjectId(id);

  const session = await getServerSession(req, res, await authOptions(req, res));
  let isLiked = false;
  let isAdmin = false;
  let proposal = null;
  if (isValidId) proposal = await getProposalById(id as string);

  if (session?.address) {
    const user = await getUserByAddress(session.address);
    isAdmin = user?.userType === "ADMIN";
    if (proposal && user) {
      const result = await getProposalLiked(user.id, id);
      isLiked = !!result;
    }
  }

  // Pass data to the page via props
  return {
    props: {
      _proposal: stringify(proposal as Object),
      isLiked,
      isAdmin,
    },
  };
};

export default function Proposals({
  _proposal,
  isLiked,
  isAdmin,
}: {
  _proposal: any;
  isLiked: boolean;
  isAdmin: boolean;
}) {
  const [proposal, setProposal] = useState<Proposal>(JSON.parse(_proposal));
  const [comments, setComments] = useState<CustomComment[]>([]);

  async function queryComments() {
    if (proposal) {
      const obj = new URLSearchParams({
        proposalId: proposal.id,
      });

      await performGET(
        "/api/comments/read",
        obj,
        (res: any) => {
          console.log("read proposal res", res);
          const result = res.data.comments;
          if (result) setComments(res.data.comments);
          console.log("comments data", res.data.comments);
        },
        (err: any) => {
          console.log("read proposal err", err);
        }
      );
    }
  }

  useEffect(() => {
    queryComments();
  }, []);

  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        <ProposalDisplay
          isCommentEnabled
          comments={comments}
          isAdmin={isAdmin}
          isLiked={isLiked}
          proposal={proposal}
        />
      </Box>
    </main>
  );
}
