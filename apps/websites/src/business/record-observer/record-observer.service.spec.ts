import { Test, TestingModule } from '@nestjs/testing';
import { RecordObserverService } from './record-observer.service';

describe('RecordObserverService', () => {
  let service: RecordObserverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordObserverService],
    }).compile();

    service = module.get<RecordObserverService>(RecordObserverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
