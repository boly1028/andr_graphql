import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { VestingAdo, VestingConfig, VestingBatchInfo } from './types'
import { VestingService } from './vesting.service'

@Resolver(VestingAdo)
export class VestingResolver {
  constructor(private readonly vestingService: VestingService) {}

  @ResolveField(() => VestingConfig)
  public async config(@Parent() vesting: VestingAdo): Promise<VestingConfig> {
    return this.vestingService.config(vesting.address)
  }

  @ResolveField(() => VestingBatchInfo)
  public async batch(@Parent() vesting: VestingAdo, @Args('id') id: number): Promise<VestingBatchInfo> {
    return this.vestingService.batch(vesting.address, id)
  }

  @ResolveField(() => [VestingBatchInfo])
  public async batches(@Parent() vesting: VestingAdo): Promise<VestingBatchInfo[]> {
    return this.vestingService.batches(vesting.address)
  }
}
