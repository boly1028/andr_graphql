import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { WasmService } from 'src/wasm/wasm.service'
import { DEFAULT_CATCH_ERR, INVALID_ADO_ERR, INVALID_QUERY_ERR } from './types'
import { AndrQuery, AndrQuerySchema, AndrQuerySchemaOld, ANDR_QUERY_OPERATOR } from './types'

@Injectable()
export class AndrQueryService {
  constructor(
    @InjectPinoLogger(AndrQueryService.name)
    protected readonly logger: PinoLogger,

    @Inject(WasmService)
    protected readonly wasmService: WasmService,
  ) {}

  public async owner(address: string, version?: string): Promise<string> {
    const queryMsg = version ? AndrQuerySchema.owner : AndrQuerySchemaOld.owner
    try {
      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse.owner
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async operators(address: string, version?: string): Promise<string[]> {
    const queryMsg = version ? AndrQuerySchema.operators : AndrQuerySchemaOld.operators
    try {
      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse.operators
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async isOperator(address: string, operator: string, version?: string): Promise<boolean> {
    const querySchema = version ? AndrQuerySchema : AndrQuerySchemaOld
    const queryMsgStr = JSON.stringify(querySchema.is_operator).replace(ANDR_QUERY_OPERATOR, operator)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse.isOperator ?? false
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async type(address: string, version?: string): Promise<string> {
    const queryMsg = version ? AndrQuerySchema.type : AndrQuerySchemaOld.type
    try {
      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse.ado_type
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async blockHeightUponCreation(address: string, version?: string): Promise<number> {
    const queryMsg = version
      ? AndrQuerySchema.block_height_upon_creation
      : AndrQuerySchemaOld.block_height_upon_creation

    try {
      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse.block_height
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async version(address: string, version?: string): Promise<string> {
    const queryMsg = version ? AndrQuerySchema.version : AndrQuerySchemaOld.version
    try {
      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse.version
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async originalPublisher(address: string, version?: string): Promise<string> {
    const queryMsg = version ? AndrQuerySchema.original_publisher : AndrQuerySchemaOld.original_publisher
    try {
      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse.original_publisher
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getContract(address: string): Promise<AndrQuery> {
    try {
      const contractInfo = await this.wasmService.getContract(address)
      const adoContractInfo = contractInfo as AndrQuery
      adoContractInfo.type = await this.type(address)
      // if (!adoType) {
      //   contractInfo.queries_expected = await this.wasmService.getContractQueries(address)
      //   if (!contractInfo.queries_expected || !contractInfo.queries_expected.includes(ANDR_QUERY)) {
      //     throw new UserInputError(INVALID_ADO_ERR)
      //   }

      //   adoType = this.getAdoType(contractInfo.queries_expected)
      // }

      // adoContractInfo.adoType = adoType
      return adoContractInfo
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_ADO_ERR)
    }
  }

  public async queryContract(address: string, queryMsg: Record<string, unknown>): Promise<any> {
    try {
      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  // private getAdoType(allowed_quries: string[]): AdoType {
  //   let adoType = AdoType.Unknown

  //   if (allowed_quries.includes(APP_QUERY)) {
  //     adoType = AdoType.App
  //   } else if (allowed_quries.includes(CW20Token_QUERY)) {
  //     adoType = AdoType.CW20
  //   } else if (allowed_quries.includes(CROWDFUND_QUERY)) {
  //     adoType = AdoType.Crowdfund
  //   } else if (allowed_quries.includes(FACTORY_QUERY)) {
  //     adoType = AdoType.Factory
  //   } else if (allowed_quries.includes(NFT_QUERY)) {
  //     adoType = AdoType.CW721
  //   } else if (allowed_quries.includes(AUCTION_QUERY)) {
  //     adoType = AdoType.Auction
  //   } else if (allowed_quries.includes(SPLITTER_QUERY)) {
  //     adoType = AdoType.Splitter
  //   } else if (allowed_quries.includes(VAULT_QUERY)) {
  //     adoType = AdoType.Vault
  //   } else if (allowed_quries.length === 1) {
  //     // only andr_query exists for Primitive
  //     adoType = AdoType.Primitive
  //   }

  //   return adoType
  // }
}
