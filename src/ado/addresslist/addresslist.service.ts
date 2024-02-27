import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { INVALID_QUERY_ERR, DEFAULT_CATCH_ERR, CHAIN_ID_NOT_FOUND_ERR } from '../types/ado.constants'
import { AddressListResponse, AddressListSchema, ADDRESSLIST_QUERY_ADDRESS } from './types'

@Injectable()
export class AddresslistService extends AdoService {
  constructor(
    @InjectPinoLogger(AddresslistService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {
    super(logger, wasmService, chainConfigService)
  }

  public async includesAddress(contractAddress: string, address: string): Promise<AddressListResponse> {
    const queryMsgStr = JSON.stringify(AddressListSchema.includes_address).replace(ADDRESSLIST_QUERY_ADDRESS, address)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const response = await this.wasmService.queryContract(contractAddress, queryMsg)
      return response as AddressListResponse
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getChainId(address: string): Promise<string> {
    try {
      const chainId = await this.chainConfigService.getChainId(address)
      if (!chainId) throw new UserInputError(CHAIN_ID_NOT_FOUND_ERR)

      return chainId
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
