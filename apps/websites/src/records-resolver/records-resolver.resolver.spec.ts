import { Test, TestingModule } from '@nestjs/testing';
import { RecordsResolverResolver } from './records-resolver.resolver';

describe('RecordsResolverResolver', () => {
  let resolver: RecordsResolverResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordsResolverResolver],
    }).compile();

    resolver = module.get<RecordsResolverResolver>(RecordsResolverResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
