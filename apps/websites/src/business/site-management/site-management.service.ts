import { Injectable } from '@nestjs/common';
import { ISiteManagementService } from './isite-management-service/isite-management-service.interface';
import { ArrayContains, Like, Repository } from 'typeorm';
import { WebSitesPagedRequest } from '../../models/request-models/web-sites-paged-request/web-sites-paged-request';
import { PagedResponse } from '../../models/response-models/paged-response/paged-response';
import { InjectRepository } from '@nestjs/typeorm';
import { WebsiteRecordEntity } from '@app/common/entities/website-record-entity/website-record-entity';
import { WebsiteCrawlExecutionPlanView } from '@app/common/entities/views/website-crawl-execution-plan-view/website-crawl-execution-plan-view';
import { WebsiteRecord } from '@app/common/models/website-record/website-record';
import { WebsiteShortRepresentation } from '@app/common/models/website-short-representation/website-short-representation';
import { WebsiteCrawlExecutionPlanEntity } from '@app/common/entities/website-crawl-execution-plan-entity/website-crawl-execution-plan-entity';
import { WebsiteCrawlEntity } from '@app/common/entities/website-crawl-entity/website-crawl-entity';

@Injectable()
export class SiteManagementService implements ISiteManagementService {
  constructor(
    @InjectRepository(WebsiteRecordEntity)
    private readonly _siteRepository: Repository<WebsiteRecordEntity>,
    @InjectRepository(WebsiteCrawlExecutionPlanView)
    private readonly _siteViewRepository: Repository<WebsiteCrawlExecutionPlanView>,
    @InjectRepository(WebsiteCrawlExecutionPlanEntity)
    private readonly _websiteCrawlExecutionPlanRepository: Repository<WebsiteCrawlExecutionPlanEntity>,
    @InjectRepository(WebsiteCrawlEntity)
    private readonly _crawlRepository: Repository<WebsiteCrawlEntity>,
  ) {}

  public async createWebsiteRecord(
    record: WebsiteRecord,
  ): Promise<WebsiteRecord> {
    return WebsiteRecord.fromEntity(
      await this._siteRepository.save(WebsiteRecordEntity.fromModel(record)),
    );
  }

  public async updateWebsiteRecord(
    record: WebsiteRecord,
  ): Promise<WebsiteRecord> {
    console.log(record);
    return WebsiteRecord.fromEntity(
      await this._siteRepository.save(WebsiteRecordEntity.fromModel(record)),
    );
  }

  //recursively delete all data related to the website record
  public async deleteWebsiteRecord(recordId: number): Promise<void> {
    await this._websiteCrawlExecutionPlanRepository.delete({
      websiteRecordId: recordId,
    });
    await this._crawlRepository.delete({ websiteRecordId: recordId });
    await this._siteRepository.delete(recordId);
  }

  public async getWebsiteRecord(recordId: number): Promise<WebsiteRecord> {
    return WebsiteRecord.fromEntity(
      await this._siteRepository.findOne({
        relations: ['tags'],
        where: { id: recordId },
      }),
    );
  }

  public async getWebsiteRecords(): Promise<WebsiteRecord[]> {
    return (await this._siteRepository.find({ relations: ['tags'] })).map(
      (record) => WebsiteRecord.fromEntity(record),
    );
  }

  public async getPagedWebsites(
    searchParams: WebSitesPagedRequest,
  ): Promise<PagedResponse<WebsiteShortRepresentation>> {
    const whereClause = [];

    if (!(searchParams.tags instanceof Array) && searchParams.tags)
      searchParams.tags = [searchParams.tags];

    if (searchParams.url)
      whereClause.push({ url: Like(`%${searchParams.url}%`) });
    if (searchParams.label)
      whereClause.push({ label: Like(`%${searchParams.label}%`) });
    if (searchParams.tags)
      whereClause.push({ tags: ArrayContains(searchParams.tags) });

    const orderColumn = searchParams.orderColumn || 'siteId';
    const orderDirection = searchParams.orderDirection || 'ASC';

    console.log(whereClause);

    const [records, total] = await this._siteViewRepository.findAndCount({
      skip: (searchParams.pageNumber - 1) * searchParams.pageSize,
      take: searchParams.pageSize,
      order: {
        [orderColumn]: orderDirection,
      },
      where: whereClause,
    });

    console.log(records);

    return new PagedResponse<WebsiteShortRepresentation>(
      searchParams.pageNumber,
      searchParams.pageSize,
      total,
      Math.ceil(total / searchParams.pageSize),
      records.map((record) => WebsiteShortRepresentation.fromEntity(record)),
    );
  }
}
