import { WebsiteCrawlEntity } from '@app/common/entities/website-crawl-entity/website-crawl-entity';

export class CrawlData {
  public startingNodeId: number;

  public url: string;

  public crawlTime: Date;

  public title: string;

  public links: string[];

  constructor(
    startingNodeId: number,
    url: string,
    crawlTime: Date,
    title: string,
    links: string[],
  ) {
    this.startingNodeId = startingNodeId;
    this.url = url;
    this.crawlTime = crawlTime;
    this.title = title;
    this.links = links;
  }

  public static fromEntity(entity: WebsiteCrawlEntity): CrawlData {
    const crawlData: CrawlData = new CrawlData(
      entity.websiteRecordId,
      entity.url,
      entity.crawlTime,
      entity.title,
      entity.outgoingUrls,
    );
    return crawlData;
  }
}
