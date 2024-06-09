import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { WebsiteRecordEntity } from '../website-record-entity/website-record-entity';
import { CrawlData } from '@app/common/models/crawl-data/crawl-data';

@Entity('WebsiteCrawlRecord')
@Unique('unique_crawl_url', ['websiteRecordId', 'url'])
export class WebsiteCrawlEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @Column()
  public title: string;

  @Column('text', { array: true, nullable: true })
  public outgoingUrls: string[];

  @Column({ nullable: true })
  public websiteRecordId: number;

  @ManyToOne(() => WebsiteRecordEntity, (websiteRecord) => websiteRecord.id)
  public websiteRecord: WebsiteRecordEntity;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  public crawlTime: Date;

  constructor(
    id: number,
    url: string,
    title: string,
    outgoingUrls: Array<string>,
    websiteRecordId: number,
    crawlTime: Date,
  ) {
    this.id = id;
    this.url = url;
    this.title = title;
    this.outgoingUrls = outgoingUrls;
    this.websiteRecordId = websiteRecordId;
    this.crawlTime = crawlTime;
  }

  public static fromModel(model: CrawlData): WebsiteCrawlEntity {
    const websiteCrawlEntity: WebsiteCrawlEntity = new WebsiteCrawlEntity(
      null,
      model.url,
      model.title,
      model.links,
      model.startingNodeId,
      model.crawlTime,
    );
    return websiteCrawlEntity;
  }
}
