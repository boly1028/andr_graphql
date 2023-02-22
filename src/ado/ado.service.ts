import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AdoType, AndrQuery, AndrQuerySchema } from 'src/ado/andr-query/types'
import { WasmService } from 'src/wasm/wasm.service'
import { ANDR_QUERY_OPERATOR, DEFAULT_CATCH_ERR, INVALID_ADO_ERR, INVALID_QUERY_ERR, TypeMismatchError } from './types'

@Injectable()
export class AdoService {
  constructor(
    @InjectPinoLogger(AdoService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
  ) {}

  public async getContract(address: string): Promise<AndrQuery> {
    try {
      const adoContractInfo = await this.wasmService.getContract(address)
      return adoContractInfo as AndrQuery
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_ADO_ERR)
    }
  }

  // TODO: Revisit unknown type conversion for TAdo
  public async getAdo<TAdo>(address: string, ado_type: AdoType): Promise<TAdo> {
    try {
      const response = await this.wasmService.queryContract(address, AndrQuerySchema.type)
      if (ado_type === AdoType.Ado || (response.ado_type && response.ado_type === ado_type)) {
        const wasmContract = await this.wasmService.getContract(address)
        return {
          address: address,
          type: response.ado_type,
          andr: wasmContract as AndrQuery,
        } as unknown as TAdo
      }

      const typeError = new TypeMismatchError(ado_type, response.ado_type)
      throw new UserInputError(typeError.error, { ...typeError })
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async owner(address: string): Promise<string> {
    try {
      const queryResponse = await this.wasmService.queryContract(address, AndrQuerySchema.owner)
      return queryResponse.owner
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async operators(address: string): Promise<string[]> {
    try {
      const queryResponse = await this.wasmService.queryContract(address, AndrQuerySchema.operators)
      return queryResponse.operators
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async isOperator(address: string, operator: string): Promise<boolean> {
    const queryMsgStr = JSON.stringify(AndrQuerySchema.is_operator).replace(ANDR_QUERY_OPERATOR, operator)
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
}
