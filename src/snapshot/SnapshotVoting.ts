import { Web3Provider, ExternalProvider } from "@ethersproject/providers";
import { appName, client, spaceName } from "./config";
import { Hex } from "viem";

export class SnapshotVoting {
  provider: ExternalProvider;

  constructor(_provider: ExternalProvider) {
    this.provider = _provider;
  }

  async vote(
    account: string,
    proposalHex: Hex,
    choice: number,
    message?: string
  ) {
    const web3 = new Web3Provider(this.provider);

    return await client.vote(web3, account, {
      space: spaceName,
      proposal: proposalHex,
      choice,
      reason: message,
      app: appName,
      type: "single-choice",
    });
  }

  async propose({
    title,
    body,
    account,
    startTime,
    snapshotBlockHeight,
    discussionLink,
  }: {
    title: string;
    body: string;
    account: string;
    discussionLink: string;
    startTime: number;
    snapshotBlockHeight: number;
  }) {
    const web3 = new Web3Provider(this.provider);
    console.log("times", startTime, Math.floor(startTime + 60 * 60 * 24 * 7));
    const receipt = await client.proposal(web3, account, {
      space: spaceName,
      title: title,
      body: body,
      discussion: discussionLink,
      start: startTime,
      end: Math.floor(startTime + 60 * 60 * 24 * 7), // hardcoded 1 week
      snapshot: snapshotBlockHeight,
      plugins: JSON.stringify({}),
      app: appName, // provide the name of your project which is using this snapshot.js integration
      type: "single-choice", // define the voting system
      choices: ["In Favor", "Against", "Abstain"],
    });

    return receipt;
  }
}
