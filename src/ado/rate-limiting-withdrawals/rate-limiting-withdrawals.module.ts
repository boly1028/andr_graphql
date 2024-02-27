import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { RateLimitingWithdrawalsResolver } from './rate-limiting-withdrawals.resolver'
import { RateLimitingWithdrawalsService } from './rate-limiting-withdrawals.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [RateLimitingWithdrawalsResolver, RateLimitingWithdrawalsService],
})
export class RateLimitingWithdrawalsModule {}
