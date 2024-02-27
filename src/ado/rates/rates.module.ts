import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { RatesResolver } from './rates.resolver'
import { RatesService } from './rates.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [RatesResolver, RatesService],
})
export class RatesModule {}
