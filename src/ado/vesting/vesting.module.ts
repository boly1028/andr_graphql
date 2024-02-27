import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { VestingResolver } from './vesting.resolver'
import { VestingService } from './vesting.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [VestingResolver, VestingService],
})
export class VestingModule {}
