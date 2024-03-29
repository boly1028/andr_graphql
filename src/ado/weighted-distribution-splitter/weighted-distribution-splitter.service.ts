import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { Splitter } from '../splitter/types'
import { INVALID_QUERY_ERR } from '../types'
import { UserWeightResponse, USER_ADDRESS, WeightedDistributionSplitterAdo } from './types'
import { WeightedDistributionSplitterSchema } from './types'

@Injectable()
export class WeightedDistributionSplitterService extends AdoService {
  constructor(
    @InjectPinoLogger(WeightedDistributionSplitterService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {
    super(logger, wasmService, chainConfigService)
  }

  public async config(contractAddress: string): Promise<Splitter> {
    try {
      const splitter = await this.wasmService.queryContract(contractAddress, WeightedDistributionSplitterSchema.config)
      return (splitter as WeightedDistributionSplitterAdo).config ?? {}
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getUserWeight(contractAddress: string, user: string): Promise<UserWeightResponse> {
    try {
      const queryMsgStr = JSON.stringify(WeightedDistributionSplitterSchema.get_user_weight).replace(USER_ADDRESS, user)
      const queryMsg = JSON.parse(queryMsgStr)

      const weight = await this.wasmService.queryContract(contractAddress, queryMsg)

      return weight as UserWeightResponse
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
