import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WebsiteRecordEntity } from "../website-record-entity/website-record-entity";
import { WebsiteCrawlExecutionPlan } from "@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan";

@Entity('WebsiteCrawlExecutionPlan')
export class WebsiteCrawlExecutionPlanEntity 
{
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public websiteRecordId: number;

  @Column('timestamp')
  public date: Date;

  @Column('timestamp', { nullable: true })
  public finishedDate: Date;

  @Column({ nullable: true })
  public numberOfCrawledPages: number;

  @Column('text')
  public state: 'Pending' | 'Running' | 'Completed' | 'Failed';

  @ManyToOne(() => WebsiteRecordEntity, websiteRecord => websiteRecord.id)
  public websiteRecord: WebsiteRecordEntity;

  constructor();
  constructor(id: number, 
      websiteRecordId: number, 
      date: Date, 
      state: 'Pending' | 'Running' | 'Completed' | 'Failed', 
      websiteRecord: WebsiteRecordEntity, 
      finishedDate?: Date, 
      numberOfCrawledPages?: number);
  constructor(id?: number, 
      websiteRecordId?: number, 
      date?: Date, 
      state?: 'Pending' | 'Running' | 'Completed' | 'Failed', 
      websiteRecord?: WebsiteRecordEntity, 
      finishedDate?: Date, 
      numberOfCrawledPages?: number) {
    this.id = id;
    this.websiteRecordId = websiteRecordId;
    this.date = date;
    this.state = state;
    this.websiteRecord = websiteRecord;
    this.finishedDate = finishedDate;
    this.numberOfCrawledPages = numberOfCrawledPages;
  }

  public static fromModel(model: WebsiteCrawlExecutionPlan): WebsiteCrawlExecutionPlanEntity
  {
    const websiteRecord: WebsiteRecordEntity = WebsiteRecordEntity.fromModel(model.websiteRecord);
    const websiteCrawlExecutionPlan: WebsiteCrawlExecutionPlanEntity = 
        new WebsiteCrawlExecutionPlanEntity(model.id, 
                                          model.websiteRecordId, 
                                          model.date, 
                                          model.state, 
                                          websiteRecord,
                                          model.finishedDate,
                                          model.numberOfCrawledPages);
    return websiteCrawlExecutionPlan;
  }
}
