import { Test, TestingModule } from '@nestjs/testing';
import { CrawlPlannerController } from './crawl-planner.controller';
import { CrawlPlannerService } from './crawl-planner.service';

describe('CrawlPlannerController', () => {
  let crawlPlannerController: CrawlPlannerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CrawlPlannerController],
      providers: [CrawlPlannerService],
    }).compile();

    crawlPlannerController = app.get<CrawlPlannerController>(CrawlPlannerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(crawlPlannerController.getHello()).toBe('Hello World!');
    });
  });
});
