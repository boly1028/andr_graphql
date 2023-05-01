import { Module } from '@nestjs/common'
import { WasmModule } from 'src/wasm/wasm.module'
import { VestingResolver } from './vesting.resolver'
import { VestingService } from './vesting.service'

@Module({
  imports: [WasmModule],
  providers: [VestingResolver, VestingService],
})
export class VestingModule {}
