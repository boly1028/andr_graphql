import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { PrimitiveService } from './primitive.service'

describe('PrimitiveService', () => {
  let service: PrimitiveService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrimitiveService,
        {
          provide: getLoggerToken(PrimitiveService.name),
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

    service = module.get<PrimitiveService>(PrimitiveService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
