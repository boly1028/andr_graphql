import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { DEFAULT_CATCH_ERR, INVALID_QUERY_ERR } from '../types'
import { AdoDBSchema } from './types'
import { VersionResponse, AdoMetadataResponse, ActionFeeResponse } from './types'
import {
  ADODB_QUERY_CODE_ID,
  ADODB_QUERY_IS_UNPUBLISHED_CODE_ID,
  ADODB_QUERY_ADO_TYPE,
  ADODB_QUERY_START_AFTER,
  ADODB_QUERY_LIMIT,
  ADODB_QUERY_ACTION,
} from './types'

@Injectable()
export class AdoDBService extends AdoService {
  constructor(
    @InjectPinoLogger(AdoDBService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {
    super(logger, wasmService, chainConfigService)
  }

  public async codeId(address: string, key: string): Promise<string> {
    try {
      const queryMsgStr = JSON.stringify(AdoDBSchema.code_id).replace(ADODB_QUERY_CODE_ID, key)
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const codeIdRes = await this.wasmService.queryContract(address, queryMsg)
      return codeIdRes as string
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async isUnpublishedCodeId(address: string, codeId: number): Promise<boolean> {
    try {
      const queryMsgStr = JSON.stringify(AdoDBSchema.is_unpublished_code_id).replace(
        ADODB_QUERY_IS_UNPUBLISHED_CODE_ID,
        codeId.toString(),
      )
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const isUnpublishedCodeIdRes = await this.wasmService.queryContract(address, queryMsg)
      return isUnpublishedCodeIdRes as boolean
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async adoType(address: string, codeId: number): Promise<string> {
    try {
      const queryMsgStr = JSON.stringify(AdoDBSchema.ado_type).replace(ADODB_QUERY_ADO_TYPE, codeId.toString())
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const adoTypeRes = await this.wasmService.queryContract(address, queryMsg)
      return adoTypeRes as string
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async allAdoTypes(address: string, startAfter?: string, limit?: number): Promise<string[]> {
    try {
      const start_after = startAfter ? startAfter : 'address-list'
      const limit_val = limit ? limit : 10
      const queryMsgStr = JSON.stringify(AdoDBSchema.all_ado_types)
        .replace(ADODB_QUERY_START_AFTER, start_after)
        .replace(ADODB_QUERY_LIMIT, limit_val.toString())
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const allAdoTypesRes = await this.wasmService.queryContract(address, queryMsg)
      return allAdoTypesRes as string[]
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async adoVerions(address: string, adoType: string, startAfter?: string, limit?: number): Promise<string[]> {
    try {
      const start_after = startAfter ? startAfter : 'address-list'
      const limit_val = limit ? limit : 10
      const queryMsgStr = JSON.stringify(AdoDBSchema.ado_versions)
        .replace(ADODB_QUERY_ADO_TYPE, adoType)
        .replace(ADODB_QUERY_START_AFTER, start_after)
        .replace(ADODB_QUERY_LIMIT, limit_val.toString())
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const adoVerionsRes = await this.wasmService.queryContract(address, queryMsg)
      return adoVerionsRes as string[]
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async adoMetadata(address: string, adoType: string): Promise<AdoMetadataResponse> {
    try {
      const queryMsgStr = JSON.stringify(AdoDBSchema.ado_metadata).replace(ADODB_QUERY_ADO_TYPE, adoType)
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const metaData = await this.wasmService.queryContract(address, queryMsg)
      return metaData as AdoMetadataResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async actionFee(address: string, adoType: string, action: string): Promise<ActionFeeResponse> {
    try {
      const queryMsgStr = JSON.stringify(AdoDBSchema.action_fee)
        .replace(ADODB_QUERY_ADO_TYPE, adoType)
        .replace(ADODB_QUERY_ACTION, action)
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const fee = await this.wasmService.queryContract(address, queryMsg)
      return fee as ActionFeeResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async actionFeeByCodeId(address: string, codeId: number, action: string): Promise<ActionFeeResponse> {
    try {
      const queryMsgStr = JSON.stringify(AdoDBSchema.action_fee_by_code_id)
        .replace(ADODB_QUERY_CODE_ID, codeId.toString())
        .replace(ADODB_QUERY_ACTION, action)
      const queryMsg = JSON.parse(queryMsgStr)
      console.log('queryMsg: ', queryMsg)

      const fee = await this.wasmService.queryContract(address, queryMsg)
      return fee as ActionFeeResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async version(address: string): Promise<VersionResponse> {
    try {
      const queryMsg = AdoDBSchema.version
      console.log('queryMsg: ', queryMsg)

      const versionRes = await this.wasmService.queryContract(address, queryMsg)
      return versionRes as VersionResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async kernelAddress(address: string): Promise<string> {
    try {
      const queryMsg = AdoDBSchema.kernel_address
      console.log('queryMsg: ', queryMsg)

      const kernelAddr = await this.wasmService.queryContract(address, queryMsg)
      return kernelAddr as string
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
