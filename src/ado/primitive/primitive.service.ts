import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { INVALID_QUERY_ERR, CHAIN_ID_NOT_FOUND_ERR, DEFAULT_CATCH_ERR } from '../types'
import { PrimitiveSchema, PrimitiveResponse, PRIMITIVE_QUERY_KEY } from './types'

@Injectable()
export class PrimitiveService extends AdoService {
  constructor(
    @InjectPinoLogger(PrimitiveService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {
    super(logger, wasmService, chainConfigService)
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

  public async getValue(contractAddress: string, key: string): Promise<PrimitiveResponse> {
    const encodedKey = Buffer.from(JSON.stringify(key)).toString('base64')
    const queryMsgStr = JSON.stringify(PrimitiveSchema.get_value).replace(PRIMITIVE_QUERY_KEY, encodedKey)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const queryResponse = await this.wasmService.queryContract(contractAddress, queryMsg)
      return queryResponse
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
