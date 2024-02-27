import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { AndrSearchOptions } from '../types'
import { INVALID_QUERY_ERR, CHAIN_ID_NOT_FOUND_ERR, DEFAULT_CATCH_ERR } from '../types'
import { Escrow, LockedFunds, TimelockSchema, TIMELOCK_QUERY_OWNER, TIMELOCK_QUERY_RECIPIENT } from './types'

@Injectable()
export class TimelockService extends AdoService {
  constructor(
    @InjectPinoLogger(TimelockService.name)
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

  public async getLockedFunds(contractAddress: string, owner: string, recipient: string): Promise<Escrow> {
    const queryMsgStr = JSON.stringify(TimelockSchema.locked_funds)
      .replace(TIMELOCK_QUERY_OWNER, owner)
      .replace(TIMELOCK_QUERY_RECIPIENT, recipient)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const lockedFunds = await this.wasmService.queryContract(contractAddress, queryMsg)
      return (lockedFunds as LockedFunds).funds ?? ({} as Escrow)
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getLockedFundsForRecipient(
    contractAddress: string,
    recipient: string,
    options?: AndrSearchOptions,
  ): Promise<Escrow[]> {
    const queryMsgStr = JSON.stringify(TimelockSchema.locked_funds_for_recipient).replace(
      TIMELOCK_QUERY_RECIPIENT,
      recipient,
    )
    const queryMsg = JSON.parse(queryMsgStr)

    if (options?.limit) queryMsg.get_locked_funds_for_recipient.limit = options?.limit
    if (options?.startAfter) queryMsg.get_locked_funds_for_recipient.start_after = options?.startAfter

    try {
      const lockedFunds = await this.wasmService.queryContract(contractAddress, queryMsg)
      return ((lockedFunds as LockedFunds).funds as Escrow[]) ?? []
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
