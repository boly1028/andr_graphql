import { Module } from '@nestjs/common'
import { WasmModule } from 'src/wasm/wasm.module'
import { WeightedDistributionSplitterResolver } from './weighted-distribution-splitter.resolver'
import { WeightedDistributionSplitterService } from './weighted-distribution-splitter.service'

@Module({
  imports: [WasmModule],
  providers: [WeightedDistributionSplitterResolver, WeightedDistributionSplitterService],
})
export class WeightedDistributionSplitterModule {}
