import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AdoType } from 'src/ado/andr-query/types'
import { AssetsService } from './assets.service'
import { AssetFilterArgs, ComponentFilterArgs, AssetResult, Component } from './types'

@Resolver(AssetResult)
export class AssetsResolver {
  constructor(private readonly assetsService: AssetsService) {}

  @Query(() => [AssetResult], {
    deprecationReason: 'Moved to `Accounts` query resolver, use `assets` field on `Accounts` to resolve this query.',
  })
  public async assets(
    @Args('walletAddress') walletAddress: string,
    @Args() filter: AssetFilterArgs,
  ): Promise<AssetResult[]> {
    return this.assetsService.getAssets(walletAddress, filter)
  }

  @ResolveField(() => [Component])
  public async components(@Parent() asset: AssetResult, @Args() filter?: ComponentFilterArgs): Promise<Component[]> {
    if (asset.adoType !== AdoType.App) return []
    const components = await this.assetsService.getComponents(asset.address, asset.chainId, filter?.componentType)
    return components
  }

  // @ResolveField(() => [NftInfo])
  // public async tokens(@Parent() asset: AssetResult, @Args() filters?: AttributeSearchOptions): Promise<NftInfo[]> {
  //   if (!(asset.adoType === AdoType.CW721 || asset.adoType === AdoType.App)) return []
  //   return this.assetsService.getTokens(asset.address, asset.adoType)
  // }

  // @ResolveField(() => String)
  // public async timestamp(@Parent() asset: AssetResult): Promise<string | undefined> {
  //   if (!asset.height) return
  //   return this.assetsService.getTimestamp(asset.height)
  // }

  // @ResolveField(() => AssetInfoResult)
  // public async assetInfo(@Parent() asset: Ado): Promise<typeof AssetInfoResult> {
  //   if (asset.adoType === AdoType[AdoType.App].toLowerCase()) {
  //     console.log('app is true')
  //     return { address: asset.contractAddress } as AdoAppContract
  //   }

  //   return { address: asset.contractAddress } as AdoContract
  // }
}
