import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql'
import { Coin } from 'src/ado/types'
import { AdoType } from '../types'
import { KernelService } from './kernel.service'
import { ChannelInfoResponse } from './types'
import { KernelAdo } from './types/kernel.query'

@Resolver(KernelAdo)
export class KernelResolver {
  constructor(private readonly kernelService: KernelService) {}

  @Query(() => KernelAdo, {
    deprecationReason: 'Moved to `ADO` query resolver, use `kernel` field on `ADO` to resolve this query.',
  })
  public async kernel(@Args('address') address: string): Promise<KernelAdo> {
    const ado = await this.kernelService.getKernel<KernelAdo>(address, AdoType.Kernel)
    ado.owner = await this.kernelService.owner(address)
    ado.operators = await this.kernelService.operators(address)
    ado.isOperator = await this.kernelService.isOperator(address, address)
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
  public async chainId(@Parent() kernel: KernelAdo): Promise<string> {
    return this.kernelService.getChainId(kernel.address)
  }

  @ResolveField(() => String)
  public async keyAddress(@Parent() kernel: KernelAdo, @Args('key') key: string): Promise<string> {
    return this.kernelService.keyAddress(kernel.address, key)
  }

  @ResolveField(() => Boolean)
  public async verifyAddress(
    @Parent() kernel: KernelAdo,
    @Args('addressToVerify') addressToVerify: string,
  ): Promise<boolean> {
    return this.kernelService.verifyAddress(kernel.address, addressToVerify)
  }

  @ResolveField(() => ChannelInfoResponse)
  public async channelInfo(@Parent() kernel: KernelAdo, @Args('chain') chain: string): Promise<ChannelInfoResponse> {
    return this.kernelService.channelInfo(kernel.address, chain)
  }

  @ResolveField(() => [Coin])
  public async recoveries(@Parent() kernel: KernelAdo, @Args('addr') addr: string): Promise<Coin[]> {
    return this.kernelService.recoveries(kernel.address, addr)
  }
}
