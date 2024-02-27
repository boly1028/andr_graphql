import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { SplitterService } from './splitter.service'
import { Splitter, SplitterAdo } from './types'

@Resolver(SplitterAdo)
export class SplitterResolver {
  constructor(private readonly splitterService: SplitterService) {}

  @ResolveField(() => Splitter)
  public async config(@Parent() splitter: SplitterAdo): Promise<Splitter> {
    return this.splitterService.config(splitter.address)
  }

  @ResolveField(() => String)
  public async chainId(@Parent() splitter: SplitterAdo): Promise<string> {
    return this.splitterService.getChainId(splitter.address)
  }
}
