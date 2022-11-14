import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { INVALID_QUERY_ERR } from '../types/ado.constants'
import { Escrow, LockedFunds, TimelockSchema, TIMELOCK_QUERY_OWNER, TIMELOCK_QUERY_RECIPIENT } from './types'

@Injectable()
export class TimelockService extends AdoService {
  constructor(
    @InjectPinoLogger(TimelockService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
  ) {
    super(logger, wasmService)
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
}
