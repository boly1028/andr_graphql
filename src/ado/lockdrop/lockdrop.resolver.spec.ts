import { Test, TestingModule } from '@nestjs/testing'
import { LockdropResolver } from './lockdrop.resolver'
import { LockdropService } from './lockdrop.service'

describe('LockdropResolver', () => {
  let resolver: LockdropResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LockdropResolver, { provide: LockdropService, useValue: {} }],
    }).compile()

    resolver = module.get<LockdropResolver>(LockdropResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
