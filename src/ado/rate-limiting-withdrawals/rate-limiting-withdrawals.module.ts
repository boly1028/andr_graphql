import { Module } from '@nestjs/common'
import { WasmModule } from 'src/wasm/wasm.module'
import { RateLimitingWithdrawalsResolver } from './rate-limiting-withdrawals.resolver'
import { RateLimitingWithdrawalsService } from './rate-limiting-withdrawals.service'

@Module({
  imports: [WasmModule],
  providers: [RateLimitingWithdrawalsResolver, RateLimitingWithdrawalsService],
})
export class RateLimitingWithdrawalsModule {}
