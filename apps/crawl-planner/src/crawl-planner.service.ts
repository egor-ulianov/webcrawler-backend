import { WebsiteCrawlExecutionPlanView } from '@app/common/entities/views/website-crawl-execution-plan-view/website-crawl-execution-plan-view';
import { WebsiteCrawlExecutionPlanEntity } from '@app/common/entities/website-crawl-execution-plan-entity/website-crawl-execution-plan-entity';
import { WebsiteRecordEntity } from '@app/common/entities/website-record-entity/website-record-entity';
import { WebsiteCrawlExecutionPlan } from '@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, LessThan, Not, Repository } from 'typeorm';

@Injectable()
export class CrawlPlannerService {
  constructor(
    @Inject('CRAWLEXECUTOR')
    private readonly _crawlClient: ClientProxy,
    @InjectRepository(WebsiteCrawlExecutionPlanView) 
    private readonly _siteViewRepository: Repository<WebsiteCrawlExecutionPlanView>,
    @InjectRepository(WebsiteCrawlExecutionPlanEntity) 
    private readonly _websiteCrawlExecutionPlanRepository: Repository<WebsiteCrawlExecutionPlanEntity>) 
  { }
  
  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async planCrawl(): Promise<void>
  {
    console.log('Planning crawl...');
    await this.planWebsiteCrawlExecution();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async crawlWebsites(): Promise<void>
  {
    console.log('Sending crawl websites...');

    let websitesToCrawl: Array<WebsiteCrawlExecutionPlan> = await this.getActiveWebsiteRecordsWithExpiredLastExecutionDate();

    websitesToCrawl.forEach(async website => {
      await this._crawlClient.emit('crawl', website);
    });
  }

  public async getActiveWebsiteRecordsWithExpiredLastExecutionDate(): Promise<WebsiteCrawlExecutionPlan[]> {
    const entities: Array<WebsiteCrawlExecutionPlanEntity> = await this._websiteCrawlExecutionPlanRepository.find({
        relations: {
            websiteRecord: true
        },
        where: {
            websiteRecord: {
                isActive: true
            },
            state: 'Pending',
            date: LessThan(new Date())
        }
    });
    console.log(entities);
    return entities.map(entity => WebsiteCrawlExecutionPlan.fromEntity(entity));
  }

  /**
   * Plan website crawl execution.
   * 1. Select all active websites with their last execution dates.
   * 2. Plan the next execution date for each website.
   */
  public async planWebsiteCrawlExecution(): Promise<void> {
      const websites: Array<WebsiteCrawlExecutionPlanView> = await this._siteViewRepository.find({
          where: [
              {
                  isActive: true,
                  state: IsNull(),
              },
              {
                  isActive: true,
                  state: Not(['Running', 'Pending']),
              }
          ]
      });
      const currentDate: Date = new Date();
      websites.forEach(async website => {
          const currentlyRunningPendingForWebsite: number = await this._websiteCrawlExecutionPlanRepository.count({
            relations: ['websiteRecord'],
            where: {
                websiteRecord: {
                  id : website.siteId
                },
                state: In(['Running', 'Pending'])
            }
          });

          if (currentlyRunningPendingForWebsite > 0) {
              return;
          }

          if (website.date == null) {
              const entity: WebsiteCrawlExecutionPlanEntity = new WebsiteCrawlExecutionPlanEntity();
              entity.websiteRecord = new WebsiteRecordEntity();
              entity.websiteRecord.id = website.siteId;
              entity.date = new Date();
              entity.state = 'Pending';
              await this._websiteCrawlExecutionPlanRepository.save(entity);
              return;
          }
          if (new Date(website.date).getTime() > currentDate.getTime())
              return;

          let nextExecutionDate: Date = new Date(website.date);
          nextExecutionDate = new Date(nextExecutionDate.getTime() + website.periodicity * 1000);
          if (nextExecutionDate > currentDate) {
              const entity: WebsiteCrawlExecutionPlanEntity = new WebsiteCrawlExecutionPlanEntity();
              entity.websiteRecord = new WebsiteRecordEntity();
              entity.websiteRecord.id = website.siteId;
              entity.date = nextExecutionDate;
              entity.state = 'Pending';
              await this._websiteCrawlExecutionPlanRepository.save(entity);
          }
      });
  }
}
