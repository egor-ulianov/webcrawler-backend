import { Injectable } from '@nestjs/common';
import { IRecordObserver } from './irecord-observer/irecord-observer.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { WebsiteCrawlEntity } from '@app/common/entities/website-crawl-entity/website-crawl-entity';
import { In, Repository } from 'typeorm';
import { CrawlData } from '@app/common/models/crawl-data/crawl-data';
import { NodeModel } from '../../models/graphql/node-model/node-model';
import { WebsiteRecordEntity } from '@app/common/entities/website-record-entity/website-record-entity';
import { WebPageModel } from '../../models/graphql/web-page-model/web-page-model';
import { WebsiteRecord } from '@app/common/models/website-record/website-record';

@Injectable()
export class RecordObserverService implements IRecordObserver {
  constructor(
    @InjectRepository(WebsiteCrawlEntity)
    private readonly _crawlRepository: Repository<WebsiteCrawlEntity>,
    @InjectRepository(WebsiteRecordEntity)
    private readonly _websiteRecordRepository: Repository<WebsiteRecordEntity>,
  ) {}

  public async getRecordsFromSourceNodes(
    sourceNodes: Array<number>,
  ): Promise<Array<CrawlData>> {
    const records = await this._crawlRepository.find({
      where: {
        websiteRecordId: In(sourceNodes),
      },
    });

    return records.map((record) => CrawlData.fromEntity(record));
  }

  public async getRecordsFromSourceNodesAsGraph(
    sourceNodes: Array<number>,
  ): Promise<Array<NodeModel>> {
    const records = await this._crawlRepository.find({
      where: {
        websiteRecordId: In(sourceNodes),
      },
    });

    const sources = await this._websiteRecordRepository.find({
      relations: ['tags'],
      where: {
        id: In(sourceNodes),
      },
    });

    console.log('Sources obtained: ', sources);

    const nodes = records.map((record) =>
      NodeModel.fromControllerModel(CrawlData.fromEntity(record)),
    );

    nodes.forEach((node) => {
      node.links = nodes.filter(
        (n) =>
          n.ownerId === node.ownerId &&
          n.url !== node.url &&
          node.linkStrings.includes(n.url),
      );
      console.log('Links ok');
      const source = sources.find((s) => s.id === node.ownerId);
      console.log('Source found: ', source);
      node.owner = WebPageModel.fromControllerModel(
        WebsiteRecord.fromEntity(sources.find((s) => s.id === node.ownerId)),
      );
      console.log('Owner ok');
    });

    return nodes;
  }
}
