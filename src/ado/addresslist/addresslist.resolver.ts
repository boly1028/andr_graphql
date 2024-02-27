import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { AddresslistService } from './addresslist.service'
import { AddressListAdo, AddressListResponse } from './types'

@Resolver(AddressListAdo)
export class AddresslistResolver {
  constructor(private readonly addresslistService: AddresslistService) {}

  @ResolveField(() => AddressListResponse)
  public async includesAddress(
    @Parent() addressList: AddressListAdo,
    @Args('address') address: string,
  ): Promise<AddressListResponse> {
    return this.addresslistService.includesAddress(addressList.address, address)
  }

  @ResolveField(() => String)
  public async chainId(@Parent() addressList: AddressListAdo): Promise<string> {
    return this.addresslistService.getChainId(addressList.address)
  }
}
