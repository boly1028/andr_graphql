import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { KernelResolver } from './kernel.resolver'
import { KernelService } from './kernel.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [KernelResolver, KernelService],
})
export class KernelModule {}
