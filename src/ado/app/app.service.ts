import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../../ado/ado.service'
import { DEFAULT_CATCH_ERR, INVALID_QUERY_ERR } from '../types'
import { AppComponent, AppComponentAddress, AppConfig, AppSchema, APP_QUERY_COMPONENT_NAME } from './types'

@Injectable()
export class AppService extends AdoService {
  constructor(
    @InjectPinoLogger(AppService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
  ) {
    super(logger, wasmService)
  }

  public async config(address: string): Promise<AppConfig> {
    try {
      const config = await this.wasmService.queryContract(address, AppSchema.config)
      return config as AppConfig
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  private async components(address: string, chainId?: string): Promise<AppComponent[]> {
    try {
      const components = await this.wasmService.queryContract(address, AppSchema.get_components, chainId)
      return components as AppComponent[]
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getComponents(address: string, chainId?: string): Promise<AppComponent[]> {
    try {
      const [components, addresses] = await Promise.all([
        this.components(address, chainId).catch(() => {
          return []
        }),
        this.getAddresses(address, chainId).catch(() => {
          return []
        }),
      ])

      const compswithAddr = components.map((item) => {
        const componentAddress = addresses.find((addr) => addr.name == item.name)
        if (componentAddress) item.address = componentAddress.address
        return item
      })

      return compswithAddr as AppComponent[]
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getAddresses(address: string, chainId?: string): Promise<AppComponentAddress[]> {
    try {
      const addresses = await this.wasmService.queryContract(address, AppSchema.get_addresses_with_names, chainId)
      return addresses as AppComponentAddress[]
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getAddress(address: string, name: string): Promise<string> {
    const queryMsgStr = JSON.stringify(AppSchema.get_address).replace(APP_QUERY_COMPONENT_NAME, name)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const addressResult = await this.wasmService.queryContract(address, queryMsg)
      return addressResult
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async componentExists(address: string, name: string): Promise<boolean> {
    const queryMsgStr = JSON.stringify(AppSchema.component_exists).replace(APP_QUERY_COMPONENT_NAME, name)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const componentResult = await this.wasmService.queryContract(address, queryMsg)
      return componentResult
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
