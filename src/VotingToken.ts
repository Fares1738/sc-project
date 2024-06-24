import { ADDRESSES } from "./utils/constants";
import { client } from "./utils/utils";
import votingTokenAbi from "./abi/VotingToken.json";
import { Address, PrivateKeyAccount } from "viem";

export class VotingToken {
  _account: PrivateKeyAccount | undefined;
  constructor(_acc: PrivateKeyAccount | undefined) {
    this._account = _acc;
  }

  async simulate(functionName: string, args: (number | Address)[]) {
    return await client.simulateContract({
      account: this._account,
      abi: votingTokenAbi.abi,
      address: ADDRESSES.tokenAddress,
      functionName,
      args,
    });
  }

  async getUserType(user: Address) {
    const simulation = await this.simulate("userType", [user]);
    return simulation.result;
  }
}
