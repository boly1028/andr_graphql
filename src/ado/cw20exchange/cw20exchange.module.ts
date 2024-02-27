import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { CW20ExchangeResolver } from './cw20exchange.resolver'
import { CW20ExchangeService } from './cw20exchange.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [CW20ExchangeResolver, CW20ExchangeService],
})
export class CW20ExchangeModule {}
