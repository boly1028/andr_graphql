import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { RatesService } from './rates.service'

describe('RatesService', () => {
  let service: RatesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatesService,
        {
          provide: getLoggerToken(RatesService.name),
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

    service = module.get<RatesService>(RatesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
