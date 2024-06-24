// "use client";

import styles from "../../../styles/page.module.css";
import NavBar from "@/components/NavBar";
import { Box } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import { Proposal } from "@prisma/client";
import { performPOST } from "@/utils/httpRequest";
import { getProposalLiked } from "../../../prisma/operations/proposals/put";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getUserByAddress } from "../../../prisma/operations/users/read";
import { getProposalById } from "../../../prisma/operations/proposals/read";
import RestrictedPage from "@/components/RestrictedPage";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { isValidObjectId } from "@/utils/utils";

export const getServerSideProps = async (ctx: any) => {
  const { params, req, res } = ctx;
  const { id } = params;
  const isValidId = isValidObjectId(id);

  // Fetch data from external API

  const session = await getServerSession(req, res, await authOptions(req, res));
  let isLiked = false;
  let proposal = null;

  if (isValidId) proposal = await getProposalById(id as string);

  if (session?.address) {
    const user = await getUserByAddress(session.address);
    if (proposal && user) {
      const result = await getProposalLiked(user.id, id);
      isLiked = !!result;
    }
  }

  // Pass data to the page via props
  return { props: { _proposal: JSON.stringify(proposal), isLiked } };
};

type VariableState = {
  value: string;
  errorMsg?: string;
};

type VarKeys = {
  title: VariableState;
  content: VariableState;
};

export default function Proposals({
  _proposal,
  isLiked,
}: {
  _proposal: any;
  isLiked: boolean;
}) {
  const { data: sessionData, status } = useSession();
  const [proposal, setProposal] = useState<Proposal>(JSON.parse(_proposal));
  const [title, setTitle] = useState(proposal ? proposal.title : "");
  const [content, setContent] = useState(proposal ? proposal.content : "");
  const comments = ["TITLE 1", "TITLE 2", "TITLE 3"];
  const { isAuth } = useAuth();

  const [data, setData] = useState<VarKeys>({
    title: {
      value: proposal ? proposal.title : "",
      errorMsg: undefined,
    } as VariableState,
    content: {
      value: proposal ? proposal.content : "",
      errorMsg: undefined,
    } as VariableState,
  });

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

  const router = useRouter();

  async function submit() {
    const obj = {
      action: "updateInfo",
      proposalId: proposal.id,
      title: data.title.value,
      content: data.content.value,
    };

    await performPOST(
      "/api/proposals/edit",
      JSON.stringify(obj),
      (res: any) => {
        console.log("edit proposal res:", res);
        router.push("/proposals/");
      },
      (err: any) => {
        console.log("edit proposal err:", err);
      }
    );
  }
  // const NoProposal = () => {
  //   return <Typography>No Proposal Found</Typography>;
  // };

  return (
    <main>
      <NavBar />
      <Box className={styles.main}>
        <RestrictedPage validAccess={isAuth as boolean}>
          <>
            <h1 className="mb-16 text-4xl font-extrabold leading-none tracking-tight text-black md:text-4xl lg:text-5xl">
              Edit Proposal{" "}
            </h1>
            <form
              className="w-1/2"
              method="POST"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
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
                <label className="block mb-2 text-sm font-medium text-black">
                  Proposal details
                </label>
                <textarea
                  onChange={handleChange}
                  // style={{width:'80%'}}
                  rows={4}
                  className="block mb-4 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="content"
                  name="content"
                  placeholder="Write your proposal here..."
                  value={data.content.value}
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  // disabled={!canSubmit}
                  type="submit"
                  onClick={submit}
                  className="btn btn-wide text-white"
                >
                  UPDATE
                </button>
              </div>
            </form>
          </>
        </RestrictedPage>
      </Box>
    </main>
  );
}
