import { Test, TestingModule } from '@nestjs/testing';
import { CrawlExecutorController } from './crawl-executor.controller';
import { CrawlExecutorService } from './crawl-executor.service';

describe('CrawlExecutorController', () => {
  let crawlExecutorController: CrawlExecutorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CrawlExecutorController],
      providers: [CrawlExecutorService],
    }).compile();

    crawlExecutorController = app.get<CrawlExecutorController>(
      CrawlExecutorController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(crawlExecutorController.getHello()).toBe('Hello World!');
    });
  });
});
