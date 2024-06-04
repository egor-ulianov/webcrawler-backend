import { Test, TestingModule } from '@nestjs/testing';
import { SiteManagementService } from './site-management.service';

describe('SiteManagementService', () => {
  let service: SiteManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteManagementService],
    }).compile();

    service = module.get<SiteManagementService>(SiteManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
