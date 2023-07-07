import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WasmModule } from 'src/wasm/wasm.module'
import { AdoResolver } from './ado.resolver'
import { AdoService } from './ado.service'
import { Ado, AdoSchema } from './types'

@Module({
  imports: [WasmModule, MongooseModule.forFeature([{ name: Ado.name, schema: AdoSchema }])],
  providers: [AdoResolver, AdoService],
})
export class AdoModule {}
