import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { INVALID_QUERY_ERR, DEFAULT_CATCH_ERR } from '../types'
import {
  MerkleAirdropConfig,
  MerkleAirdropSchema,
  MerkleRootResponse,
  MERKLE_AIRDROP_ADDRESS,
  MERKLE_AIRDROP_STAGE,
} from './types'

@Injectable()
export class MerkleAirdropService extends AdoService {
  constructor(
    @InjectPinoLogger(MerkleAirdropService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {
    super(logger, wasmService, chainConfigService)
  }

  public async config(address: string): Promise<MerkleAirdropConfig> {
    try {
      const MerkleRootConfig = await this.wasmService.queryContract(address, MerkleAirdropSchema.config)
      return MerkleRootConfig as MerkleAirdropConfig
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async merkleRoot(address: string, stage: number): Promise<MerkleRootResponse> {
    const queryMsgStr = JSON.stringify(MerkleAirdropSchema.merkle_root).replace(
      '"' + MERKLE_AIRDROP_STAGE + '"',
      String(stage),
    )
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse as MerkleRootResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async latestStage(address: string): Promise<number> {
    try {
      const queryResponse = await this.wasmService.queryContract(address, MerkleAirdropSchema.latest_stage)
      return (queryResponse.latest_stage as number) ?? 0
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async isClaimed(contractAddress: string, stage: number, address: string): Promise<boolean> {
    const queryMsgStr = JSON.stringify(MerkleAirdropSchema.is_claimed)
      .replace('"' + MERKLE_AIRDROP_STAGE + '"', String(stage))
      .replace(MERKLE_AIRDROP_ADDRESS, address)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const queryResponse = await this.wasmService.queryContract(contractAddress, queryMsg)
      return queryResponse as boolean
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async totalClaimed(contractAddress: string, stage: number): Promise<string> {
    const queryMsgStr = JSON.stringify(MerkleAirdropSchema.total_claimed).replace(
      '"' + MERKLE_AIRDROP_STAGE + '"',
      String(stage),
    )
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const queryResponse = await this.wasmService.queryContract(contractAddress, queryMsg)
      return queryResponse as string
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
