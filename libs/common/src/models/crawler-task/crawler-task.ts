import { WebsiteCrawlExecutionPlan } from '@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan';

export class CrawlerTask {
  public urls: string[];

  public initialNode: WebsiteCrawlExecutionPlan;

  constructor(urls: string[], initialNode: WebsiteCrawlExecutionPlan) {
    this.urls = urls;
    this.initialNode = initialNode;
  }
}
