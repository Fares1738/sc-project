import { Address, defineChain } from "viem";
require("dotenv").config();

export const ADDRESSES = {
  tokenAddress: "0x96040854dd0fDB4F2B32F659E9D0e2B7489d419b" as Address,
  admin: "0x17fBA9Eb71F040d57d19B48A28002FfE32380DF8" as Address,
  keeper: "0x31AbDc2218F45bA76626b86149a6edB5cC2a7134" as Address,
};

export const chains = {
  mainnet: defineChain({
    id: 1,
    name: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: {
        http: [process.env.MAINNET_RPC as string],
      },
    },
    blockExplorers: {
      default: {
        name: "Etherscan",
        url: "https://etherscan.io",
        apiUrl: "https://api.etherscan.io/api",
      },
    },
    contracts: {
      ensRegistry: {
        address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      },
      ensUniversalResolver: {
        address: "0xce01f8eee7E479C928F8919abD53E553a36CeF67",
        blockCreated: 19_258_213,
      },
      multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11",
        blockCreated: 14_353_601,
      },
    },
  }),
  sepolia: defineChain({
    id: 11_155_111,
    name: "Sepolia",
    nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: {
        http: [process.env.SEPOLIA_RPC as string],
      },
    },
    blockExplorers: {
      default: {
        name: "Etherscan",
        url: "https://sepolia.etherscan.io",
        apiUrl: "https://api-sepolia.etherscan.io/api",
      },
    },
    contracts: {
      multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11",
        blockCreated: 751532,
      },
      ensRegistry: { address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" },
      ensUniversalResolver: {
        address: "0xc8Af999e38273D658BE1b921b88A9Ddf005769cC",
        blockCreated: 5_317_080,
      },
    },
    testnet: true,
  }),
};

export const SNAPSHOT_GRAPHQL_PROD = "https://hub.snapshot.org/graphql";
export const SNAPSHOT_GRAPHQL_TESTNET =
  "https://testnet.hub.snapshot.org/graphql";

export const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Laboratory",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
