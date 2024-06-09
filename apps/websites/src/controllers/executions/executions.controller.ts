import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { IExecutionManagementService } from '../../business/execution-management/iexecution-management-service/iexecution-management-service.interface';
import { ExecutionManagementService } from '../../business/execution-management/execution-management.service';
import { WebsiteCrawlExecutionPlan } from '@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan';
import { WebSitesExecutionsPagedRequest } from '../../models/request-models/web-sites-executions-paged-request/web-sites-executions-paged-request';
import { PagedResponse } from '../../models/response-models/paged-response/paged-response';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/executions')
export class ExecutionsController {
  private readonly _executionManagementService: IExecutionManagementService;

  constructor(
    @Inject(ExecutionManagementService)
    executionManagementService: ExecutionManagementService,
  ) {
    this._executionManagementService = executionManagementService;
  }

  /**
   * METHOD Post
   * Creates a new execution plan
   *
   * @param execution - The execution plan to be created
   * @returns Created execution plan
   */
  @Post()
  @ApiOperation({ summary: 'Creates a new execution plan' })
  @ApiResponse({ status: 201, description: 'The created execution plan' })
  @ApiBody({ type: WebsiteCrawlExecutionPlan })
  public async createExecution(
    @Body() execution: WebsiteCrawlExecutionPlan,
  ): Promise<WebsiteCrawlExecutionPlan> {
    return await this._executionManagementService.createExecution(execution);
  }

  /**
   * METHOD Get
   * Gets a paged list of execution plans
   *
   * @param searchParams - The search parameters
   * @returns Paged list of execution plans
   */
  @Get()
  @ApiOperation({ summary: 'Gets a paged list of execution plans' })
  @ApiResponse({
    status: 200,
    description: 'The paged list of execution plans',
  })
  public async getPagedExecutions(
    @Query() searchParams: WebSitesExecutionsPagedRequest,
  ): Promise<PagedResponse<WebsiteCrawlExecutionPlan>> {
    return await this._executionManagementService.getPagedExecutions(
      searchParams,
    );
  }

  /**
   * METHOD Get
   * Gets a specific execution plan
   *
   * @param id - The id of the execution plan
   * @returns The execution plan
   */
  @Get(':id')
  @ApiOperation({ summary: 'Gets a specific execution plan' })
  @ApiResponse({ status: 200, description: 'The execution plan' })
  public async getExecution(
    @Param('id') id: number,
  ): Promise<WebsiteCrawlExecutionPlan> {
    return await this._executionManagementService.getExecution(id);
  }
}
