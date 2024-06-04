import { Test, TestingModule } from '@nestjs/testing';
import { TagsManagementService } from './tags-management.service';

describe('TagsManagementService', () => {
  let service: TagsManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsManagementService],
    }).compile();

    service = module.get<TagsManagementService>(TagsManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
