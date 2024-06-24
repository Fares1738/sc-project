import { Box, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function Loading({ children }: { children: ReactNode }) {
  const { status } = useSession();

  return (
    <CustomLoading active={status === "loading"}> {children } </CustomLoading>
  );
}

export function CustomLoading({
  children,
  active,
}: {
  children: ReactNode;
  active: boolean;
}) {
  const LoadingSpinner = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        position: "absolute",
        top: 0,
        bottom: 0,
      }}
    >
      <CircularProgress />
    </Box>
  );
  return active ? <LoadingSpinner /> : children;
}
