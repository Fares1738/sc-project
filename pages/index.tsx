// "use client";

import NavBar from "@/components/NavBar";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <Box sx={{ height: "100vh" }}>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          p: "32px 96px",
          m: 2,
          background: "#A7E6FF",
          borderRadius: 3,
        }}
      >
        <Box>
          <Typography variant="h3">Persaka DAO Voting System</Typography>
          <Typography maxWidth="500px" variant="body1">
            Persaka Voting DAO System, A platform made for FC students, to
            participate on on-going discussions, vote, and transparently track
            the voting progress.
          </Typography>
        </Box>
        <Box>
          {/* <Typography>B</Typography> */}
          <Image
            src="/voting.png"
            width={500}
            height={500}
            layout="fixed"
            objectFit="contain"
            alt=""
          />
        </Box>
      </Box>
    </Box>
  );
}
