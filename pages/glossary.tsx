// "use client";
import NavBar from "@/components/NavBar";
import { Box, Typography } from "@mui/material";
import { useAccount } from "wagmi";

export default function Home() {
  return (
    <main>
      <NavBar />
      <Box>
        <Typography>Glossary</Typography>
        <p>
          <b>CM:</b> Committee Member
        </p>
        <p>
          <b>VP:</b> Voting Power
        </p>
        <p>
          <b>Block Snapshot:</b> Block number at which the proposal voting power
          would be retrieved from, thinking of it like freezing time in the
          past, using the voting power of that time.
        </p>
        <p>
          <b>Proposal states:</b>
          <ul style={{ paddingLeft: 8 }}>
            <li>
              <b>Draft</b>
              The proposal is only accessible by the admin and Comittee Members,
              they are able to edit the proposals.
            </li>
            <li>
              <b>Active</b>A state, at which anyone can access the proposal, in
              addition students are able to comment on the active proposals, as
              well as liking the proposals.
            </li>
            <li>
              <b>Finalized</b>A finalized state, at whihc no more editing can be
              applied nor comemnts can be added, the proposal is pushed to
              snapshot for voting, any students can vote within the proposal
              voting period.
            </li>
          </ul>
        </p>
      </Box>
    </main>
  );
}
