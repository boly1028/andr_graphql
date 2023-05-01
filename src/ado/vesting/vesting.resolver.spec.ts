import { Test, TestingModule } from '@nestjs/testing'
import { VestingResolver } from './vesting.resolver'
import { VestingService } from './vesting.service'

describe('VestingResolver', () => {
  let resolver: VestingResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VestingResolver, { provide: VestingService, useValue: {} }],
    }).compile()

    resolver = module.get<VestingResolver>(VestingResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
