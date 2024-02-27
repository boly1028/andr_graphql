import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { CW721Service } from './cw721.service'

describe('CW721Service', () => {
  let service: CW721Service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CW721Service,
        {
          provide: getLoggerToken(CW721Service.name),
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

    service = module.get<CW721Service>(CW721Service)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
