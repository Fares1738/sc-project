import { ADDRESSES } from "./utils/constants";
import { client, walletClient } from "./utils/utils";
import votingTokenAbi from "./abi/VotingToken.json";
import { Address } from "viem";
import { VotingToken } from "./VotingToken";
import { account } from "./utils/restrictedUtils";

export class AdminVotingToken extends VotingToken {
  constructor() {
    super(account);
  }
  async execute(request: any) {
    await walletClient.writeContract(request);
  }
}
