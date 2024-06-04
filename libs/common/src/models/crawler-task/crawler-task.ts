import { WebsiteCrawlExecutionPlan } from "@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan";
import { WebsiteRecord } from "@app/common/models/website-record/website-record";

export class CrawlerTask
{
    public urls: string[];

    public initialNode: WebsiteCrawlExecutionPlan;

    constructor(urls: string[], initialNode: WebsiteCrawlExecutionPlan)
    {
        this.urls = urls;
        this.initialNode = initialNode;
    }
}
