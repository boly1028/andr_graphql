import { Args, Query, Resolver } from '@nestjs/graphql'
import { AssetsService } from './assets.service'
import { AssetResult } from './types/assets.result'

@Resolver(AssetResult)
export class AssetsResolver {
  constructor(private readonly assetsService: AssetsService) {}

  @Query(() => [AssetResult])
  public async assets(@Args('walletAddress') walletAddress: string): Promise<AssetResult[]> {
    return this.assetsService.getAssets(walletAddress)
  }

  // @ResolveField(() => AssetInfoResult)
  // public async assetInfo(@Parent() asset: AssetResult): Promise<typeof AssetInfoResult> {
  //   console.log(asset)
  //   console.log(AdoType[AdoType.App].toLowerCase())
  //   if (asset.adoType === AdoType[AdoType.App].toLowerCase()) {
  //     console.log('app is true')
  //     return { address: asset.contractAddress } as AdoAppContract
  //   }

  //   return { address: asset.contractAddress } as AdoContract
  // }
}