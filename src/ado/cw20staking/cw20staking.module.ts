import { Module } from '@nestjs/common'
import { WasmModule } from 'src/wasm/wasm.module'
import { CW20StakingResolver } from './cw20staking.resolver'
import { CW20StakingService } from './cw20staking.service'

@Module({
  imports: [WasmModule],
  providers: [CW20StakingResolver, CW20StakingService],
})
export class CW20StakingModule {}
