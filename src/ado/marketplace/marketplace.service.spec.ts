import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { WasmService } from 'src/wasm/wasm.service'
import { MarketplaceService } from './marketplace.service'

describe('MarketplaceService', () => {
  let service: MarketplaceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceService,
        {
          provide: getLoggerToken(MarketplaceService.name),
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

    service = module.get<MarketplaceService>(MarketplaceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
