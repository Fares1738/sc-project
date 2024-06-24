import { Hex, createPublicClient, http } from "viem";
import { bscTestnet, localhost, mainnet, sepolia } from "viem/chains";
import { createWalletClient, custom } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { chains } from "./constants";

TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

require("dotenv").config();

const chain = bscTestnet;
// const activeChain = sepolia;

export const client = createPublicClient({
  chain,
  transport: http(),
});

export const activeClient = createPublicClient({
  chain: chain,
  transport: http(),
});

export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain,
  transport: http(),
});

export const formatTime = (time: Date) => {
  return timeAgo.format(time);
};

export const stringify = (o: Object) => {
  return JSON.stringify(
    o,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
};

export const getProposalColor = (proposalStatus: string) => {
  switch (proposalStatus) {
    case "Active":
      return "green";
    case "Draft":
      return "orange";
    default:
      return "blue";
  }
};

export const getUserTypeColor = (userType: string) => {
  switch (userType) {
    case "STUDENT":
      return "blue";
    case "CM":
      return "purple";
    default:
      return "red";
  }
};

export const isValidObjectId = (id: string) => {
  const validate = new RegExp("^[0-9a-fA-F]{24}$");
  return validate.test(id);
};
