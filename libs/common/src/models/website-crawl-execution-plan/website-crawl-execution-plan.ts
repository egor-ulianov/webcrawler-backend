import { WebsiteCrawlExecutionPlanEntity } from '@app/common/entities/website-crawl-execution-plan-entity/website-crawl-execution-plan-entity';
import { WebsiteRecord } from '../website-record/website-record';
import { ApiProperty } from '@nestjs/swagger';

export class WebsiteCrawlExecutionPlan {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public websiteRecordId: number;

  @ApiProperty()
  public date: Date;

  @ApiProperty()
  public state: 'Pending' | 'Running' | 'Completed' | 'Failed';

  @ApiProperty()
  public websiteRecord: WebsiteRecord;

  @ApiProperty()
  public finishedDate: Date;

  @ApiProperty()
  public numberOfCrawledPages: number;

  constructor(
    id: number,
    websiteRecordId: number,
    date: Date,
    state: 'Pending' | 'Running' | 'Completed' | 'Failed',
    websiteRecord: WebsiteRecord,
    finishedDate?: Date,
    numberOfCrawledPages?: number,
  ) {
    this.id = id;
    this.websiteRecordId = websiteRecordId;
    this.date = date;
    this.state = state;
    this.websiteRecord = websiteRecord;
    this.finishedDate = finishedDate;
    this.numberOfCrawledPages = numberOfCrawledPages;
  }

  public static fromEntity(
    entity: WebsiteCrawlExecutionPlanEntity,
  ): WebsiteCrawlExecutionPlan {
    const websiteRecord: WebsiteRecord = WebsiteRecord.fromEntity(
      entity.websiteRecord,
    );
    const websiteCrawlExecutionPlan: WebsiteCrawlExecutionPlan =
      new WebsiteCrawlExecutionPlan(
        entity.id,
        entity.websiteRecordId,
        entity.date,
        entity.state,
        websiteRecord,
        entity.finishedDate,
        entity.numberOfCrawledPages,
      );
    return websiteCrawlExecutionPlan;
  }
}
