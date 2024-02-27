import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { WeightedDistributionSplitterResolver } from './weighted-distribution-splitter.resolver'
import { WeightedDistributionSplitterService } from './weighted-distribution-splitter.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [WeightedDistributionSplitterResolver, WeightedDistributionSplitterService],
})
export class WeightedDistributionSplitterModule {}
