"use client";

import styles from "../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import { useAccount } from "wagmi";
import { Box } from "@mui/material";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Proposal } from "@/utils/types";
import { performBriefPOST } from "@/utils/httpRequest";
import RestrictedPage from "@/components/RestrictedPage";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

const styling = {
  row: { display: "flex", flexDirection: "row" },
  column: { display: "flex", flexDirection: "column" },
};

type VariableState = {
  value: string;
  errorMsg?: string;
};

const defaultValue = {
  value: "",
  errorMsg: undefined,
} as VariableState;

type VarKeys = {
  title: VariableState;
  content: VariableState;
};

export default function Home() {
  const { address } = useAccount();
  const { data: sessionData, status, update } = useSession();
  const { isAuth } = useAuth();
  const [data, setData] = useState<VarKeys>({
    title: defaultValue,
    content: defaultValue,
  });

  const handleRegistration = (e: any) => {
    e.preventDefault();
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let validation = false;
    const errorMsg: string | undefined = undefined;
    switch (name) {
      case "title":
        validation = true;
        break;
      case "content":
        validation = true;
        break;
      default:
        validation = false;
        break;
    }

    setData((prev) => ({
      ...prev,
      [name]: {
        value,
        errorMsg,
      } as VariableState,
    }));
  };

  // Destructure data
  const { ...allData } = data;

  // Disable submit button until all fields are filled in
  const canSubmit = [...Object.values(allData)].every((v) => !v.errorMsg);

  const router = useRouter();

  async function submit() {
    const obj: Proposal = {
      content: data.content.value,
      title: data.title.value,
    };

    await performBriefPOST(
      "/api/proposals/create",
      JSON.stringify(obj),
      "create proposal"
    );
    router.push("/proposals/");
  }

  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        <RestrictedPage validAccess={!!isAuth}>
          <>
            <h1 className="mb-16 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl ">
              Create New Proposal{" "}
            </h1>
            <form className="w-1/2" method="POST" onSubmit={handleRegistration}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="..."
                  value={data.title.value}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Proposal details
                </label>
                <textarea
                  onChange={handleChange}
                  // style={{width:'80%'}}
                  rows={4}
                  className="block mb-4 p-2.5 w-full text-sm text-white bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="content"
                  name="content"
                  placeholder="Write your proposal here..."
                  value={data.content.value}
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  disabled={!canSubmit}
                  type="submit"
                  onClick={submit}
                  className="btn btn-wide text-white"
                >
                  CREATE
                </button>
              </div>
            </form>
          </>
        </RestrictedPage>
      </Box>
    </main>
  );
}
