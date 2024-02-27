import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { CW20StakingResolver } from './cw20staking.resolver'
import { CW20StakingService } from './cw20staking.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [CW20StakingResolver, CW20StakingService],
})
export class CW20StakingModule {}
