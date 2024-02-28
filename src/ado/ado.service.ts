import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Inject, Injectable, Optional } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ApolloError, UserInputError } from 'apollo-server'
import { Model } from 'mongoose'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AdoType, AndrQuery, AndrQuerySchema, AndrQuerySchemaOld } from 'src/ado/andr-query/types'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { NOT_FOUND_ERR } from 'src/wasm/types/wasm.constants'
import { WasmService } from 'src/wasm/wasm.service'
import {
  Ado,
  AdoInput,
  ANDR_QUERY_OPERATOR,
  DEFAULT_CATCH_ERR,
  INVALID_ADO_ERR,
  INVALID_QUERY_ERR,
  MONGO_ADO_ALREADY_EXISTS_ERROR,
  MONGO_CREATE_ADO_ERROR,
  MONGO_QUERY_ERROR,
  MONGO_UPDATE_ADO_ERROR,
  TypeMismatchError,
  UpdateAdoOwnerInput,
  CHAIN_ID_NOT_FOUND_ERR,
} from './types'

@Injectable()
export class AdoService {
  constructor(
    @InjectPinoLogger(AdoService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
    @Optional()
    @InjectModel(Ado.name)
    private adoModel?: Model<Ado>,
  ) {}

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
      const version = await this.getVersion(address)
      const queryMsg = version.split('.')[1] === '2' ? AndrQuerySchema.type : AndrQuerySchemaOld.type
      const response = await this.wasmService.queryContract(address, queryMsg)
      const adoType = response.ado_type === 'app-contract' ? 'app' : response.ado_type

      if (ado_type === AdoType.Ado || (response.ado_type && adoType === ado_type)) {
        const wasmContract = await this.wasmService.getContract(address)
        const andr = wasmContract as AndrQuery
        andr.contractVersion = version
        return {
          address: address,
          type: response.ado_type,
          andr,
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

  public async getAdoSmart<TJSON>(address: string, query: string): Promise<TJSON> {
    try {
      const chainUrl = await this.chainConfigService.getChainUrl(address, '')
      if (!chainUrl) throw new UserInputError(NOT_FOUND_ERR)

      const version = await this.wasmService.getContractVersion(address)
      const queryMsg = version.split('.')[1] === '2' ? AndrQuerySchema.type : AndrQuerySchemaOld.type
      const response = await this.wasmService.queryContract(address, queryMsg)
      const adoType = response?.ado_type

      const queryObj = JSON.parse(query.replace(/'/g, `"`))
      const property = Object.keys(queryObj)[0]

      const queryClient = await CosmWasmClient.connect(chainUrl)
      const queryResult = await queryClient.queryContractSmart(address, queryObj)

      return {
        address,
        adoType,
        query: property,
        queryResult,
      } as unknown as TJSON
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
      const version = await this.wasmService.getContractVersion(address)
      const queryMsg = version.split('.')[1] === '2' ? AndrQuerySchema.owner : AndrQuerySchemaOld.owner
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

  public async operators(address: string): Promise<string[]> {
    try {
      const version = await this.wasmService.getContractVersion(address)
      const queryMsg = version.split('.')[1] === '2' ? AndrQuerySchema.operators : AndrQuerySchemaOld.operators
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

  public async isOperator(address: string, operator: string): Promise<boolean> {
    try {
      const version = await this.wasmService.getContractVersion(address)
      const querySchema = version.split('.')[1] === '2' ? AndrQuerySchema : AndrQuerySchemaOld

      const queryMsgStr = JSON.stringify(querySchema.is_operator).replace(ANDR_QUERY_OPERATOR, operator)
      const queryMsg = JSON.parse(queryMsgStr)

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

  public async saveNewAdo(input: AdoInput): Promise<Ado> {
    try {
      const ado = await this.adoModel?.findOne({ address: input.address })
      if (ado) throw new UserInputError(MONGO_ADO_ALREADY_EXISTS_ERROR)

      const saveAdo = await this.adoModel?.create(input)
      if (!saveAdo) throw new UserInputError(MONGO_CREATE_ADO_ERROR)

      return saveAdo
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(MONGO_CREATE_ADO_ERROR)
    }
  }

  public async updateAdoOwner(input: UpdateAdoOwnerInput): Promise<Ado> {
    try {
      const ado = await this.adoModel?.findOneAndUpdate(
        {
          $and: [{ address: input.address }, { lastUpdatedHeight: { $lt: input.txHeight } }],
        },
        { $set: { owner: input.newOwner, lastUpdatedHeight: input.txHeight } },
        { new: true },
      )
      if (!ado) throw new UserInputError(MONGO_UPDATE_ADO_ERROR)

      return ado
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(MONGO_UPDATE_ADO_ERROR)
    }
  }

  public async getAdoByAddress(address: string): Promise<Ado> {
    try {
      const ado = await this.adoModel?.findOne({ address: address })
      if (!ado) throw new UserInputError(MONGO_QUERY_ERROR)
      return ado
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }
      throw new ApolloError(MONGO_QUERY_ERROR, address)
    }
  }

  private async getVersion(address: string): Promise<string> {
    const version = await this.wasmService.getContractVersion(address)
    return version
  }
}
