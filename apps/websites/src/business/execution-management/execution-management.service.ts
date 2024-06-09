import { Injectable } from '@nestjs/common';
import { IExecutionManagementService } from './iexecution-management-service/iexecution-management-service.interface';
import { WebsiteCrawlExecutionPlan } from '@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan';
import { WebSitesExecutionsPagedRequest } from '../../models/request-models/web-sites-executions-paged-request/web-sites-executions-paged-request';
import { PagedResponse } from '../../models/response-models/paged-response/paged-response';
import { InjectRepository } from '@nestjs/typeorm';
import { WebsiteCrawlExecutionPlanEntity } from '@app/common/entities/website-crawl-execution-plan-entity/website-crawl-execution-plan-entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExecutionManagementService implements IExecutionManagementService {
  constructor(
    @InjectRepository(WebsiteCrawlExecutionPlanEntity)
    private readonly _websiteCrawlExecutionPlanRepository: Repository<WebsiteCrawlExecutionPlanEntity>,
  ) {}

  public createExecution(
    execution: WebsiteCrawlExecutionPlan,
  ): Promise<WebsiteCrawlExecutionPlan> {
    return this._websiteCrawlExecutionPlanRepository.save(
      WebsiteCrawlExecutionPlanEntity.fromModel(execution),
    );
  }

  public getExecution(id: number): Promise<WebsiteCrawlExecutionPlan> {
    return this._websiteCrawlExecutionPlanRepository
      .findOne({ where: { id: id } })
      .then((execution: WebsiteCrawlExecutionPlanEntity) =>
        WebsiteCrawlExecutionPlan.fromEntity(execution),
      );
  }

  public getPagedExecutions(
    request: WebSitesExecutionsPagedRequest,
  ): Promise<PagedResponse<WebsiteCrawlExecutionPlan>> {
    const whereClause = [];
    if (request.siteId) whereClause.push({ websiteRecordId: request.siteId });

    const orderColumn = 'id';
    const orderDirection = 'ASC';

    return this._websiteCrawlExecutionPlanRepository
      .findAndCount({
        skip: (request.pageNumber - 1) * request.pageSize,
        take: request.pageSize,
        relations: ['websiteRecord'],
        order: {
          [orderColumn]: orderDirection,
        },
        where: whereClause,
      })
      .then(([executions, total]) => {
        return new PagedResponse<WebsiteCrawlExecutionPlan>(
          request.pageNumber,
          request.pageSize,
          total,
          Math.ceil(total / request.pageSize),
          executions.map((execution: WebsiteCrawlExecutionPlanEntity) =>
            WebsiteCrawlExecutionPlan.fromEntity(execution),
          ),
        );
      });
  }
}
