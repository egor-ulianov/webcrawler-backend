import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionManagementService } from './execution-management.service';

describe('ExecutionManagementService', () => {
  let service: ExecutionManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecutionManagementService],
    }).compile();

    service = module.get<ExecutionManagementService>(
      ExecutionManagementService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
