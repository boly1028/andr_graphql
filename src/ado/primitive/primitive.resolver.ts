import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { PrimitiveService } from './primitive.service'
import { PrimitiveAdo, PrimitiveResponse } from './types'

@Resolver(PrimitiveAdo)
export class PrimitiveResolver {
  constructor(private readonly primitiveService: PrimitiveService) {}

  @ResolveField(() => String)
  public async chainId(@Parent() primitive: PrimitiveAdo): Promise<string> {
    return this.primitiveService.getChainId(primitive.address)
  }

  @ResolveField(() => PrimitiveResponse)
  public async getValue(@Parent() primitive: PrimitiveAdo, @Args('key') key: string): Promise<PrimitiveResponse> {
    return this.primitiveService.getValue(primitive.address, key)
  }
}
