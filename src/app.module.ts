import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MongooseModule } from '@nestjs/mongoose'
// import { ThrottlerModule } from '@nestjs/throttler'
import { LoggerModule } from 'nestjs-pino'
import { join } from 'path'
import pino from 'pino'
import { AccountsModule } from './accounts/accounts.module'
import { AssetsModule } from './accounts/assets/assets.module'
import { AdoPackageModule } from './ado-package/ado-package.module'
import { AddresslistModule } from './ado/addresslist/addresslist.module'
import { AdoModule } from './ado/ado.module'
import { AndrQueryModule } from './ado/andr-query/andr-query.module'
import { AppAdoModule } from './ado/app/app-ado.module'
import { AuctionModule } from './ado/auction/auction.module'
import { CrowdfundModule } from './ado/crowdfund/crowdfund.module'
import { CW20Module } from './ado/cw20/cw20.module'
import { CW20ExchangeModule } from './ado/cw20exchange/cw20exchange.module'
import { CW20StakingModule } from './ado/cw20staking/cw20staking.module'
import { CW721Module } from './ado/cw721/cw721.module'
import { FactoryModule } from './ado/factory/factory.module'
import { LockdropModule } from './ado/lockdrop/lockdrop.module'
import { MarketplaceModule } from './ado/marketplace/marketplace.module'
import { MerkleAirdropModule } from './ado/merkle-airdrop/merkle-airdrop.module'
import { PrimitiveModule } from './ado/primitive/primitive.module'
import { RateLimitingWithdrawalsAdo } from './ado/rate-limiting-withdrawals/types'
import { RatesModule } from './ado/rates/rates.module'
import { SplitterModule } from './ado/splitter/splitter.module'
import { TimelockModule } from './ado/timelock/timelock.module'
import { registerEnums } from './ado/types/ado.enums'
import { VaultModule } from './ado/vault/vault.module'
import { VestingModule } from './ado/vesting/vesting.module'
import { WeightedDistributionSplitterModule } from './ado/weighted-distribution-splitter/weighted-distribution-splitter.module'
import { ChainConfigModule } from './chain-config/chain-config.module'
import { CosmModule } from './cosm'
import { validate } from './env.validation'
import { KeplrConfigModule } from './keplr-config/keplr-config.module'
import { TxModule } from './tx/tx.module'
import { WasmModule } from './wasm/wasm.module'
@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, validate }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const pinoHttp: pino.LoggerOptions = {
          name: config.get<string>('LOG_NAME'),
          level: config.get<string>('LOG_LEVEL'),
          prettyPrint: false,
        }

        if (config.get<string>('NODE_ENV') !== 'production') {
          pinoHttp.prettyPrint = {
            colorize: true,
            singleLine: true,
            translateTime: true,
          }
        }

        return { pinoHttp }
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'), // Loaded from .ENV
      }),
    }),
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     ttl: parseInt(config.get<string>('THROTTLE_TTL', '60'), 10),
    //     limit: parseInt(config.get<string>('THROTTLE_LIMIT', '20'), 10),
    //   }),
    // }),
    // Persisted queries are enabled and are using an unbounded cache.
    // Your server is vulnerable to denial of service attacks via memory exhaustion.
    // Set `cache: "bounded"` or `persistedQueries: false` in your ApolloServer constructor, or
    // see https://go.apollo.dev/s/cache-backends for other alternatives.
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: (config: ConfigService) => {
        registerEnums() // register enums graphql

        return {
          sortSchema: config.get<string>('GRAPHQL_SORT_SCHEMA', 'true') === 'true',
          debug: config.get<string>('GRAPHQL_DEBUG', 'false') === 'true',
          playground: config.get<string>('GRAPHQL_PLAYGROUND', 'false') === 'true',
          autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
          introspection: config.get<string>('GRAPHQL_INTROSPECTION', 'true') === 'true',
          subscriptions: {
            'graphql-ws': true,
          },
        }
      },
    }),
    CosmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const RPC_URL = config.get<string>('RPC_URL')
        if (!RPC_URL) {
          throw new Error('Invalid RPC_URL variable.')
        }

        return {
          RPC_URL,
        }
      },
    }),
    AndrQueryModule,
    AddresslistModule,
    AppAdoModule,
    AuctionModule,
    LockdropModule,
    CrowdfundModule,
    CW20Module,
    CW20StakingModule,
    CW20ExchangeModule,
    FactoryModule,
    CW721Module,
    KeplrConfigModule,
    PrimitiveModule,
    RateLimitingWithdrawalsAdo,
    RatesModule,
    SplitterModule,
    TimelockModule,
    WeightedDistributionSplitterModule,
    VaultModule,
    VestingModule,
    MarketplaceModule,
    MerkleAirdropModule,
    TxModule,
    WasmModule,
    AssetsModule,
    ChainConfigModule,
    AdoPackageModule,
    AdoModule,
    AccountsModule,
  ],
})
export class AppModule {}
