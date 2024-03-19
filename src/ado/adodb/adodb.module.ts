import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { AdoDBResolver } from './adodb.resolver'
import { AdoDBService } from './adodb.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [AdoDBResolver, AdoDBService],
})
export class AdoDBModule {}
