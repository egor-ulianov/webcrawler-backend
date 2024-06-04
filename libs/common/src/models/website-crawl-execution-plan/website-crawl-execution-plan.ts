import { WebsiteCrawlExecutionPlanEntity } from "@app/common/entities/website-crawl-execution-plan-entity/website-crawl-execution-plan-entity";
import { WebsiteRecord } from "../website-record/website-record";

export class WebsiteCrawlExecutionPlan 
{
    public id: number;
    public websiteRecordId: number;
    public date: Date;
    public state: 'Pending' | 'Running' | 'Completed' | 'Failed';
    public websiteRecord: WebsiteRecord;
    public finishedDate: Date;
    public numberOfCrawledPages: number;

    constructor(id: number, 
        websiteRecordId: number, 
        date: Date, state: 'Pending' | 'Running' | 'Completed' | 'Failed', 
        websiteRecord: WebsiteRecord,
        finishedDate?: Date,
        numberOfCrawledPages?: number)
    {
        this.id = id;
        this.websiteRecordId = websiteRecordId;
        this.date = date;
        this.state = state;
        this.websiteRecord = websiteRecord;
        this.finishedDate = finishedDate;
        this.numberOfCrawledPages = numberOfCrawledPages;
    }

    public static fromEntity(entity: WebsiteCrawlExecutionPlanEntity): WebsiteCrawlExecutionPlan
    {
        const websiteRecord: WebsiteRecord = WebsiteRecord.fromEntity(entity.websiteRecord);
        const websiteCrawlExecutionPlan: WebsiteCrawlExecutionPlan = 
            new WebsiteCrawlExecutionPlan(entity.id, 
                                          entity.websiteRecordId, 
                                          entity.date, 
                                          entity.state, 
                                          websiteRecord,
                                          entity.finishedDate,
                                          entity.numberOfCrawledPages);
        return websiteCrawlExecutionPlan;
    }
}
