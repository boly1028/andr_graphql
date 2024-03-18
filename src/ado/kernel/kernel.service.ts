import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { DEFAULT_CATCH_ERR, INVALID_QUERY_ERR, Coin } from '../types'
// import { AdoType } from '../types'
import { KernelSchema, ChannelInfoResponse } from './types'
import {
  KERNEL_QUERY_KEY_ADDRESS,
  KERNEL_QUERY_VERIFY_ADDRESS,
  KERNEL_QUERY_CHANNEL_INFO,
  KERNEL_QUERY_RECOVERIES,
} from './types'

@Injectable()
export class KernelService extends AdoService {
  constructor(
    @InjectPinoLogger(KernelService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {
    super(logger, wasmService, chainConfigService)
  }

  public async keyAddress(address: string, key: string): Promise<string> {
    try {
      const queryMsgStr = JSON.stringify(KernelSchema.key_address).replace(KERNEL_QUERY_KEY_ADDRESS, key)
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const keyAddress = await this.wasmService.queryContract(address, queryMsg)
      return keyAddress as string
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async verifyAddress(address: string, addressToVerify: string): Promise<boolean> {
    try {
      const queryMsgStr = JSON.stringify(KernelSchema.verify_address).replace(
        KERNEL_QUERY_VERIFY_ADDRESS,
        addressToVerify,
      )
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const verifyRes = await this.wasmService.queryContract(address, queryMsg)
      return verifyRes as boolean
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async channelInfo(address: string, chain: string): Promise<ChannelInfoResponse> {
    try {
      const queryMsgStr = JSON.stringify(KernelSchema.channel_info).replace(KERNEL_QUERY_CHANNEL_INFO, chain)
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const channelInfoRes = await this.wasmService.queryContract(address, queryMsg)
      return channelInfoRes as ChannelInfoResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async recoveries(address: string, addr: string): Promise<Coin[]> {
    try {
      const queryMsgStr = JSON.stringify(KernelSchema.recoveries).replace(KERNEL_QUERY_RECOVERIES, addr)
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const recoveriesRes = await this.wasmService.queryContract(address, queryMsg)
      return (recoveriesRes ?? []) as Coin[]
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
