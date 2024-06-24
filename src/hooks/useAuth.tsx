import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";

export function useAuth() {
  const { status } = useSession();
  const { address, isConnected } = useAccount();
  return { isAuth: status === "authenticated" && address && isConnected };
}
