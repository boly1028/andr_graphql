import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { CW20Service } from './cw20.service'

describe('CW20Service', () => {
  let service: CW20Service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CW20Service,
        {
          provide: getLoggerToken(CW20Service.name),
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

    service = module.get<CW20Service>(CW20Service)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
