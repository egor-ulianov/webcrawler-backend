import { CrawlerTask } from './crawler-task';

describe('CrawlerTask', () => {
  it('should be defined', () => {
    expect(new CrawlerTask(null, null)).toBeDefined();
  });
});
