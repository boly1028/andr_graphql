import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { getCosmToken } from 'src/cosm'
import { WasmResolver } from './wasm.resolver'
import { WasmService } from './wasm.service'

describe('WasmResolver', () => {
  let resolver: WasmResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WasmResolver,
        WasmService,
        {
          provide: getLoggerToken(WasmService.name),
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: getCosmToken(),
          useValue: {},
        },
        {
          provide: ChainConfigService,
          useValue: {},
        },
      ],
    }).compile()

    resolver = module.get<WasmResolver>(WasmResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
