import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { CW20ExchangeService } from './cw20exchange.service'

describe('CW20StakingService', () => {
  let service: CW20ExchangeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CW20ExchangeService,
        {
          provide: getLoggerToken(CW20ExchangeService.name),
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

    service = module.get<CW20ExchangeService>(CW20ExchangeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
