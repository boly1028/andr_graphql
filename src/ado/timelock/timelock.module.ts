import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { TimelockResolver } from './timelock.resolver'
import { TimelockService } from './timelock.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [TimelockResolver, TimelockService],
})
export class TimelockModule {}
