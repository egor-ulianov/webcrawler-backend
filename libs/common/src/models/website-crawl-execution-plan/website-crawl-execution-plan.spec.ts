import { WebsiteCrawlExecutionPlan } from './website-crawl-execution-plan';

describe('WebsiteCrawlExecutionPlan', () => {
  it('should be defined', () => {
    expect(
      new WebsiteCrawlExecutionPlan(null, null, null, null, null),
    ).toBeDefined();
  });
});
