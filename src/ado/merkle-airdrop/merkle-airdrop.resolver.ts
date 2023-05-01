import { Args, Int, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { MerkleAirdropService } from './merkle-airdrop.service'
import { MerkleAirdropAdo, MerkleAirdropConfig, MerkleRootResponse } from './types'

@Resolver(MerkleAirdropAdo)
export class MerkleAirdropResolver {
  constructor(private readonly merkleAirdropService: MerkleAirdropService) {}

  @ResolveField(() => MerkleAirdropConfig)
  public async config(@Parent() merkleAirdrop: MerkleAirdropAdo): Promise<MerkleAirdropConfig> {
    return this.merkleAirdropService.config(merkleAirdrop.address)
  }

  @ResolveField(() => MerkleRootResponse)
  public async merkleRoot(
    @Parent() merkleAirdrop: MerkleAirdropAdo,
    @Args('stage') stage: number,
  ): Promise<MerkleRootResponse> {
    return this.merkleAirdropService.merkleRoot(merkleAirdrop.address, stage)
  }

  @ResolveField(() => Int)
  public async latestStage(@Parent() merkleAirdrop: MerkleAirdropAdo): Promise<number> {
    return this.merkleAirdropService.latestStage(merkleAirdrop.address)
  }

  @ResolveField(() => Boolean)
  public async isClaimed(
    @Parent() merkleAirdrop: MerkleAirdropAdo,
    @Args('stage') stage: number,
    @Args('address') address: string,
  ): Promise<boolean> {
    return this.merkleAirdropService.isClaimed(merkleAirdrop.address, stage, address)
  }

  @ResolveField(() => String)
  public async totalClaimed(@Parent() merkleAirdrop: MerkleAirdropAdo, @Args('stage') stage: number): Promise<string> {
    return this.merkleAirdropService.totalClaimed(merkleAirdrop.address, stage)
  }
}
