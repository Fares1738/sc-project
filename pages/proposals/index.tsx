// "use client";

import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import {
  Box,
  Button,
  List,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getProposals } from "../../prisma/operations/proposals/read";
import { stringify } from "@/utils/utils";
import { Proposal } from "@prisma/client";
import { useUser } from "@/hooks/useUser";
import ProposalListItem from "@/components/ProposalListItem";

export const getServerSideProps = async () => {
  const proposals = await getProposals();
  // Pass data to the page via props
  return { props: { _proposals: stringify(proposals) } };
};

export default function Proposals({ _proposals }: { _proposals: any }) {
  const { userType, isAdminOrCM } = useUser();
  const [proposals, setProposals] = useState<Proposal[]>(
    JSON.parse(_proposals)
  );
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (searchText === "") setProposals(JSON.parse(_proposals));
    else {
      //
      setProposals(
        proposals.filter((p) => p.title.toLowerCase().includes(searchText))
      );
    }
  }, [searchText, _proposals, proposals]);

  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        {userType === "ADMIN" && (
          <Box
            sx={{
              width: "640px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              sx={{
                color: "black",
                border: "2px black solid",
                borderRadius: 2,
                mb: 1,
              }}
              href="/proposals/create"
            >
              Create Proposal
            </Button>
          </Box>
        )}
        <TextField
          sx={{ width: "640px", mb: 2 }}
          id="outlined-basic"
          label="Search Proposal"
          variant="outlined"
          value={searchText}
          onChange={(e) => {
            //
            setSearchText(e.target.value);
          }}
        />
        <List>
          {proposals.map((p, i) => {
            return !(!isAdminOrCM && p.status === "Draft") ? (
              <ProposalListItem p={p} i={i}/>
            ) : (
              <></>
            );
          })}
        </List>
      </Box>
    </main>
  );
}
