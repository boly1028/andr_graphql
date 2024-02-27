import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { CrowdfundResolver } from './crowdfund.resolver'
import { CrowdfundService } from './crowdfund.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [CrowdfundResolver, CrowdfundService],
})
export class CrowdfundModule {}
