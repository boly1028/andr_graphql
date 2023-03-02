import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmResolver } from './wasm.resolver'
import { WasmService } from './wasm.service'

@Module({
  imports: [ChainConfigModule],
  providers: [WasmResolver, WasmService],
  exports: [WasmService],
})
export class WasmModule {}
