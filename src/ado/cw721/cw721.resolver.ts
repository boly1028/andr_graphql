import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AndrSearchOptions } from '../types'
import { AdoType } from '../types/ado.enums'
import { CW721Service } from './cw721.service'
import { CW721Ado, AllNftInfo, NftApproval, NftContractInfo, NftInfo, NftOwnerInfo, TransferAgreement } from './types'
import { AttributeSearchOptions } from './types/cw721.query'

@Resolver(CW721Ado)
export class CW721Resolver {
  constructor(private readonly cw721Service: CW721Service) {}

  @Query(() => CW721Ado, {
    deprecationReason: 'Moved to `ADO` query resolver, use `cw721` field on `ADO` to resolve this query.',
  })
  public async cw721(@Args('address') address: string): Promise<CW721Ado> {
    const ado = await this.cw721Service.getAdo<CW721Ado>(address, AdoType.CW721)
    ado.owner = await this.cw721Service.owner(address)
    ado.operators = await this.cw721Service.operators(address)
    ado.isOperator = await this.cw721Service.isOperator(address, address)
    ado.codeId = ado.andr.codeId
    ado.creator = ado.andr.creator
    ado.admin = ado.andr.admin
    ado.label = ado.andr.label
    ado.ibcPortId = ado.andr.ibcPortId
    ado.queries_expected = ado.andr.queries_expected

    return ado
  }

  //FIX: unknown variant minter
  //Query failed with (18): Error parsing into type
  //  andromeda_non_fungible_tokens::cw721::QueryMsg: unknown variant `minter`
  @ResolveField(() => String)
  public async minter(@Parent() cw721: CW721Ado): Promise<string> {
    return this.cw721Service.minter(cw721.address)
  }

  @ResolveField(() => NftOwnerInfo)
  public async ownerOf(
    @Parent() cw721: CW721Ado,
    @Args('tokenId') tokenId: string,
    @Args('includeExpired') includeExpired: boolean,
  ): Promise<NftOwnerInfo> {
    return this.cw721Service.ownerOf(cw721.address, tokenId, includeExpired)
  }

  @ResolveField(() => [NftApproval])
  public async allOperators(
    @Parent() cw721: CW721Ado,
    @Args('owner') owner: string,
    @Args('includeExpired') includeExpired: boolean,
    @Args('options', { nullable: true }) options: AndrSearchOptions,
  ): Promise<NftApproval[]> {
    return this.cw721Service.allOperators(cw721.address, owner, includeExpired, options)
  }

  //FIX: unknown variant approval
  //Query failed with (18): Error parsing into type
  //  andromeda_non_fungible_tokens::cw721::QueryMsg: unknown variant `approval`
  @ResolveField(() => NftApproval)
  public async approval(
    @Parent() cw721: CW721Ado,
    @Args('tokenId') tokenId: string,
    @Args('spender') spender: string,
    @Args('includeExpired') includeExpired: boolean,
  ): Promise<NftApproval> {
    return this.cw721Service.approval(cw721.address, tokenId, spender, includeExpired)
  }

  //FIX: unknown variant approvals
  //Query failed with (18): Error parsing into type
  //  andromeda_non_fungible_tokens::cw721::QueryMsg: unknown variant `approvals`
  @ResolveField(() => [NftApproval])
  public async approvals(
    @Parent() cw721: CW721Ado,
    @Args('tokenId') tokenId: string,
    @Args('includeExpired') includeExpired: boolean,
  ): Promise<NftApproval[]> {
    return this.cw721Service.approvals(cw721.address, tokenId, includeExpired)
  }

  @ResolveField(() => Int)
  public async numTokens(@Parent() cw721: CW721Ado): Promise<number> {
    return this.cw721Service.numTokens(cw721.address)
  }

  @ResolveField(() => NftInfo)
  public async nftInfo(@Parent() cw721: CW721Ado, @Args('tokenId') tokenId: string): Promise<NftInfo> {
    return this.cw721Service.nftInfo(cw721.address, tokenId)
  }

  @ResolveField(() => AllNftInfo)
  public async allNftInfo(
    @Parent() cw721: CW721Ado,
    @Args('tokenId') tokenId: string,
    @Args('includeExpired') includeExpired: boolean,
  ): Promise<AllNftInfo> {
    return this.cw721Service.allNftInfo(cw721.address, tokenId, includeExpired)
  }

  //FIX: unknown variant
  //Query failed with (18): Error parsing into type
  // andromeda_non_fungible_tokens::cw721::QueryMsg: unknown variant `is_archived`
  @ResolveField(() => Boolean)
  public async isArchived(@Parent() cw721: CW721Ado, @Args('tokenId') tokenId: string): Promise<boolean> {
    return this.cw721Service.isArchived(cw721.address, tokenId)
  }

  //FIX: unknown variant
  //Query failed with (18): Error parsing into type
  // andromeda_non_fungible_tokens::cw721::QueryMsg: unknown variant `transfer_agreeement`
  @ResolveField(() => TransferAgreement)
  public async transferAgreement(
    @Parent() cw721: CW721Ado,
    @Args('tokenId') tokenId: string,
  ): Promise<TransferAgreement> {
    return this.cw721Service.transferAgreement(cw721.address, tokenId)
  }

  @ResolveField(() => [String])
  public async tokens(
    @Parent() cw721: CW721Ado,
    @Args('owner') owner: string,
    @Args('options', { nullable: true }) options: AndrSearchOptions,
  ): Promise<string[]> {
    return this.cw721Service.tokens(cw721.address, owner, options)
  }

  @ResolveField(() => [String])
  public async allTokens(
    @Parent() cw721: CW721Ado,
    @Args('options', { nullable: true }) options: AndrSearchOptions,
  ): Promise<string[]> {
    return this.cw721Service.allTokens(cw721.address, options)
  }

  @ResolveField(() => [NftInfo])
  public async searchTokens(@Parent() cw721: CW721Ado, @Args() filters?: AttributeSearchOptions): Promise<NftInfo[]> {
    return this.cw721Service.searchTokens(cw721.address, filters?.attributes)
  }

  @ResolveField(() => NftContractInfo)
  public async contractInfo(@Parent() cw721: CW721Ado): Promise<NftContractInfo> {
    return this.cw721Service.contractInfo(cw721.address)
  }

  @ResolveField(() => Int)
  public async numOwners(@Parent() cw721: CW721Ado, @Args('includeExpired') includeExpired: boolean): Promise<number> {
    return this.cw721Service.numOwners(cw721.address, includeExpired)
  }
}
