import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql'
import { AdoType } from '../types'
import { AdoDBService } from './adodb.service'
import { AdoDBAdo } from './types/adodb.query'

@Resolver(AdoDBAdo)
export class AdoDBResolver {
  constructor(private readonly adoDBService: AdoDBService) {}

  @Query(() => AdoDBAdo, {
    deprecationReason: 'Moved to `ADO` query resolver, use `kernel` field on `ADO` to resolve this query.',
  })
  public async kernel(@Args('address') address: string): Promise<AdoDBAdo> {
    const ado = await this.adoDBService.getAdoDB<AdoDBAdo>(address, AdoType.Adodb)
    ado.owner = await this.adoDBService.owner(address)
    ado.operators = await this.adoDBService.operators(address)
    ado.isOperator = await this.adoDBService.isOperator(address, address)
    ado.codeId = ado.andr.codeId
    ado.creator = ado.andr.creator
    ado.admin = ado.andr.admin
    ado.label = ado.andr.label
    ado.ibcPortId = ado.andr.ibcPortId
    ado.queries_expected = ado.andr.queries_expected

    console.log(ado)

    return ado
  }

  @ResolveField(() => String)
  public async chainId(@Parent() adoDB: AdoDBAdo): Promise<string> {
    return this.adoDBService.getChainId(adoDB.address)
  }

  @ResolveField(() => String)
  public async codeId(@Parent() adoDB: AdoDBAdo, @Args('key') key: string): Promise<string> {
    return this.adoDBService.codeId(adoDB.address, key)
  }

  @ResolveField(() => Boolean)
  public async isUnpublishedCodeId(@Parent() adoDB: AdoDBAdo, @Args('codeId') codeId: number): Promise<boolean> {
    return this.adoDBService.isUnpublishedCodeId(adoDB.address, codeId)
  }

  @ResolveField(() => String)
  public async adoType(@Parent() adoDB: AdoDBAdo, @Args('codeId') codeId: number): Promise<string> {
    return this.adoDBService.adoType(adoDB.address, codeId)
  }

  @ResolveField(() => [String])
  public async allAdoTypes(
    @Parent() adoDB: AdoDBAdo,
    @Args('startAfter', { nullable: true }) startAfter: string,
    @Args('limit', { nullable: true }) limit: number,
  ): Promise<string[]> {
    return this.adoDBService.allAdoTypes(adoDB.address, startAfter, limit)
  }
}
