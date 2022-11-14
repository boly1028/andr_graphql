import { Module } from '@nestjs/common'
import { WasmModule } from 'src/wasm/wasm.module'
import { TimelockResolver } from './timelock.resolver'
import { TimelockService } from './timelock.service'

@Module({
  imports: [WasmModule],
  providers: [TimelockResolver, TimelockService],
})
export class TimelockModule {}
