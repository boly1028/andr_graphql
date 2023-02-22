import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ChainConfigResolver } from './chain-config.resolver'
import { ChainConfigService } from './chain-config.service'
import { ChainConfig } from './types'
import { ChainConfigSchema } from './types/chain-config.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: ChainConfig.name, schema: ChainConfigSchema }])],
  providers: [ChainConfigResolver, ChainConfigService],
  exports: [ChainConfigService],
})
export class ChainConfigModule {}
