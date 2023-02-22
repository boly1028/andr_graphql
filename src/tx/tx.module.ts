import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { TxResolver } from './tx.resolver'
import { TxService } from './tx.service'

@Module({
  imports: [ChainConfigModule],
  providers: [TxResolver, TxService],
  exports: [TxService],
})
export class TxModule {}
