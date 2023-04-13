import { Module } from '@nestjs/common'
import { WasmModule } from 'src/wasm/wasm.module'
import { CW20ExchangeResolver } from './cw20exchange.resolver'
import { CW20ExchangeService } from './cw20exchange.service'

@Module({
  imports: [WasmModule],
  providers: [CW20ExchangeResolver, CW20ExchangeService],
})
export class CW20ExchangeModule {}
