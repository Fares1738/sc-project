import { SNAPSHOT_GRAPHQL_TESTNET } from "@/utils/constants";
import { ApolloClient, gql } from "@apollo/client";
import { cache } from "./cache";
import {
  GQLs,
  constructProposalGQL,
  constructVotesGQL,
  constructVotingPowerGQL,
} from "./gqlQueries";

export class SnapshotGraphQL {
  private client = new ApolloClient({
    cache,
    uri: SNAPSHOT_GRAPHQL_TESTNET,
  });
  async getProposals() {
    const res = await this.client.query({
      query: GQLs.PROPOSALS,
    });
    return res.error
      ? null
      : res.data["proposals"].map((p: any) => {
          return p;
        });
  }

  async getProposal(id: string) {
    const res = await this.client.query({
      query: constructProposalGQL(id),
    });
    const p = res.data["proposal"];
    return res.error ? null : p;
  }

  async getVotes() {
    const res = await this.client.query({
      query: GQLs.VOTES,
    });
    return res.error
      ? null
      : res.data["votes"].map((p: any) => {
          return p;
        });
  }

  async getVote(proposalId: string, voter: string) {
    const res = await this.client.query({
      query: constructVotesGQL(proposalId, voter),
    });
    const p = res.data["votes"];
    return res.error ? null : p;
  }

  async getVotingPower(proposalId: string, voter: string) {
    const res = await this.client.query({
      query: constructVotingPowerGQL(proposalId, voter),
    });
    const p = res.data["vp"];
    return res.error ? null : p;
  }
}
