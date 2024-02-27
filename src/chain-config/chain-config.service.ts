import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ApolloError, UserInputError } from 'apollo-server'
import { Model } from 'mongoose'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { DEFAULT_CATCH_ERR, MONGO_QUERY_ERROR } from 'src/ado/andr-query/types'
import { ChainConfig, CHAIN_CONFIGS_NOT_FOUND_ERR, CHAIN_CONFIG_NOT_FOUND_ERR } from './types'

@Injectable()
export class ChainConfigService {
  constructor(
    @InjectPinoLogger(ChainConfigService.name)
    protected readonly logger: PinoLogger,
    @InjectModel(ChainConfig.name)
    private chainConfigModel?: Model<ChainConfig>,
  ) {}

  public async getAllConfigs(): Promise<ChainConfig[]> {
    try {
      const chainConfigs = await this.chainConfigModel?.find()
      if (!chainConfigs || !chainConfigs.length) throw new UserInputError(CHAIN_CONFIGS_NOT_FOUND_ERR)

      return chainConfigs
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(MONGO_QUERY_ERROR)
    }
  }

  public async getConfig(identifier: string): Promise<ChainConfig> {
    try {
      const chainConfig = await this.chainConfigModel?.findOne({ $or: [{ chainId: identifier }, { name: identifier }] })
      if (!chainConfig) throw new UserInputError(CHAIN_CONFIG_NOT_FOUND_ERR)

      return chainConfig
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, identifier)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(MONGO_QUERY_ERROR, identifier)
    }
  }

  public async getChainUrl(address: string, chainId?: string): Promise<string | undefined> {
    let chainConfig: ChainConfig | null | undefined
    try {
      if (chainId) {
        chainConfig = await this.chainConfigModel?.findOne({ chainId: chainId })
      } else {
        const chainConfigs = await this.chainConfigModel?.find()
        if (!chainConfigs || !chainConfigs.length) throw new UserInputError(CHAIN_CONFIGS_NOT_FOUND_ERR)

        chainConfig = chainConfigs.find((c) => address.startsWith(c.addressPrefix))
      }
      return chainConfig?.chainUrl
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(MONGO_QUERY_ERROR)
    }
  }

  public async getChainId(address: string): Promise<string> {
    let chainConfig: ChainConfig | null | undefined
    try {
      const chainConfigs = await this.chainConfigModel?.find()
      if (!chainConfigs || !chainConfigs.length) throw new UserInputError(CHAIN_CONFIGS_NOT_FOUND_ERR)

      chainConfig = chainConfigs.find((c) => address.startsWith(c.addressPrefix))
      return chainConfig!.chainId
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(MONGO_QUERY_ERROR)
    }
  }
}
