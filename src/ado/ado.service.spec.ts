import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from './ado.service'

describe('AdoService', () => {
  let service: AdoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdoService,
        {
          provide: getLoggerToken(AdoService.name),
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: WasmService,
          useValue: {},
        },
        {
          provide: ChainConfigService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<AdoService>(AdoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
