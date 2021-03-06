import { Test, TestingModule } from '@nestjs/testing';
import { DiariesResolver } from './diaries.resolver';

describe('DiariesResolver', () => {
  let resolver: DiariesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiariesResolver],
    }).compile();

    resolver = module.get<DiariesResolver>(DiariesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
