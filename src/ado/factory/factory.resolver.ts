import { Args, Int, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { FactoryService } from './factory.service'
import { FactoryAdo } from './types'

@Resolver(FactoryAdo)
export class FactoryResolver {
  constructor(private readonly factoryService: FactoryService) {}

  @ResolveField(() => Int)
  public async code_id(@Parent() factory: FactoryAdo, @Args('key') key: string): Promise<number> {
    return this.factoryService.getCodeId(factory.address, key)
  }

  @ResolveField(() => String)
  public async chainId(@Parent() factory: FactoryAdo): Promise<string> {
    return this.factoryService.getChainId(factory.address)
  }
}
