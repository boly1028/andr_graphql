import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { RateLimitingWithdrawalsService } from './rate-limiting-withdrawals.service'

describe('RateLimitingWithdrawalsService', () => {
  let service: RateLimitingWithdrawalsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitingWithdrawalsService,
        {
          provide: getLoggerToken(RateLimitingWithdrawalsService.name),
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

    service = module.get<RateLimitingWithdrawalsService>(RateLimitingWithdrawalsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
