import { WebsiteCrawlExecutionPlan } from "@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan";
import { WebSitesExecutionsPagedRequest } from "apps/websites/src/models/request-models/web-sites-executions-paged-request/web-sites-executions-paged-request";
import { PagedResponse } from "apps/websites/src/models/response-models/paged-response/paged-response";

export interface IExecutionManagementService 
{
    createExecution(execution: WebsiteCrawlExecutionPlan): Promise<WebsiteCrawlExecutionPlan>;

    getExecution(id: number): Promise<WebsiteCrawlExecutionPlan>;

    getPagedExecutions(request: WebSitesExecutionsPagedRequest): Promise<PagedResponse<WebsiteCrawlExecutionPlan>>;
}
