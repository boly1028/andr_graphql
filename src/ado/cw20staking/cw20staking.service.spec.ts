import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { WasmService } from 'src/wasm/wasm.service'
import { CW20StakingService } from './cw20staking.service'

describe('CW20StakingService', () => {
  let service: CW20StakingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CW20StakingService,
        {
          provide: getLoggerToken(CW20StakingService.name),
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: WasmService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<CW20StakingService>(CW20StakingService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
