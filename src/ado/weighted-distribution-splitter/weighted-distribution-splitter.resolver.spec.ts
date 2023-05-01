import { Test, TestingModule } from '@nestjs/testing'
import { WeightedDistributionSplitterResolver } from './weighted-distribution-splitter.resolver'
import { WeightedDistributionSplitterService } from './weighted-distribution-splitter.service'

describe('WeightedDistributionSplitterResolver', () => {
  let resolver: WeightedDistributionSplitterResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeightedDistributionSplitterResolver, { provide: WeightedDistributionSplitterService, useValue: {} }],
    }).compile()

    resolver = module.get<WeightedDistributionSplitterResolver>(WeightedDistributionSplitterResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
