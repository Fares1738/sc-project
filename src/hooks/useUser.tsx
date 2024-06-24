import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAuth } from "./useAuth";
import { performGET } from "@/utils/httpRequest";

export function useUser() {
  const [uType, setUType] = useState("");
  const [fullName, setFullName] = useState("");

  const { isAuth } = useAuth();
  const { status } = useSession();
  const { address, isConnected } = useAccount();

  async function queryUser() {
    if (address) {
      const obj = new URLSearchParams({
        userAddress: address,
        name: "self",
      });

      await performGET(
        "/api/users/read",
        obj,
        (res: any) => {
          console.log("read user res", res);
          const result = res.data;
          setUType(result ? result.userType : "");
          setFullName(result ? result.fullName : "");
        },
        (err: any) => {
          setUType("");
          setFullName("");
          console.log("read proposal err", err);
        }
      );
    } else {
      setUType("");
      setFullName("");
    }
  }

  useEffect(() => {
    queryUser();
  }, [isConnected, isAuth, address, status]);

  return {
    userType: uType,
    fullName,
    isAdminOrCM: ["ADMIN", "CM"].includes(uType.toLocaleUpperCase()),
  };
}
