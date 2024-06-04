import { WebsiteCrawlExecutionPlan } from "@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan";
import { WebsiteRecord } from "@app/common/models/website-record/website-record";
import { WebsiteShortRepresentation } from "@app/common/models/website-short-representation/website-short-representation";
import { WebSitesPagedRequest } from "apps/websites/src/models/request-models/web-sites-paged-request/web-sites-paged-request";
import { PagedResponse } from "apps/websites/src/models/response-models/paged-response/paged-response";


export interface ISiteManagementService 
{
    createWebsiteRecord(record: WebsiteRecord): Promise<WebsiteRecord>;

    updateWebsiteRecord(record: WebsiteRecord): Promise<WebsiteRecord>;

    deleteWebsiteRecord(recordId: number): Promise<void>;

    getWebsiteRecord(recordId: number): Promise<WebsiteRecord>;

    getPagedWebsites(searchParams: WebSitesPagedRequest): Promise<PagedResponse<WebsiteShortRepresentation>>;
}
