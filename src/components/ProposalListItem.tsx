import React from 'react'
import { Proposal } from "@prisma/client";
import { Box, IconButton, ListItem, Typography } from '@mui/material';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAccount } from 'wagmi';
import { useUser } from '@/hooks/useUser';
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import { formatTime, getProposalColor } from '@/utils/utils';

const ProposalListItem = ({ p, i }: { p: Proposal; i: number; }) => {
  const { isConnected } = useAccount();
  const { isAdminOrCM } = useUser();
  return (
    <ListItem
      sx={{
        border: "3px black solid",
        borderRadius: 3,
        mb: 2,
        pb: 2,
      }}
      key={i}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: 600,
          // maxWidth: 900,
          minHeight: 150,
        }}
      >
        <Box
          sx={{
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box>
            {/* Actions */}
            <IconButton
              href={"/proposals/view/" + p.id}
              target="blank"
            >
              <VisibilityIcon />
            </IconButton>
            {isConnected && isAdminOrCM && p.status === "Draft" && (
              <IconButton
                href={"/proposals/edit/" + p.id}
                target="blank"
              >
                <EditIcon />
              </IconButton>
            )}

            {p.status === "Published" && (
              <IconButton
                href={
                  "https://testnet.snapshot.org/#/persaka.eth/proposal/" +
                  p.proposalIdHash
                }
                target="_blank"
              >
                <OpenInNewIcon />
              </IconButton>
            )}
          </Box>

          <Typography
            sx={{
              color: "white",
              background: getProposalColor(p.status),
              p: 0.5,
              borderRadius: 2,
              mr: 2,
              textAlign: "center",
              minWidth: "80px",
            }}
            variant="body2"
          >
            {p.status}
          </Typography>
        </Box>
        <Box mb={2}>
          <Typography mb={2} variant="h4">
            {p.title}
          </Typography>
          <Typography variant="body2">
            {p.content.length > 120
              ? p.content.substring(0, 120) + "..."
              : p.content}
          </Typography>
        </Box>

        <Typography
          sx={{
            background: "gray",
            color: "white",
            width: "100px",
            textAlign: "center",
            borderRadius: 4,
          }}
          // sx={{ position: "absolute", bottom: 0, right: 0, p: 2 }}
          variant="body2"
        >
          {formatTime(new Date(p.createdAt))}
        </Typography>
      </Box>
    </ListItem>
  )
}

export default ProposalListItem