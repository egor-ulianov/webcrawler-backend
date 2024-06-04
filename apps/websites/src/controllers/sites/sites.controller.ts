import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ISiteManagementService } from '../../business/site-management/isite-management-service/isite-management-service.interface';
import { SiteManagementService } from '../../business/site-management/site-management.service';
import { WebSitesPagedRequest } from '../../models/request-models/web-sites-paged-request/web-sites-paged-request';
import { PagedResponse } from '../../models/response-models/paged-response/paged-response';
import { WebsiteRecord } from '@app/common/models/website-record/website-record';
import { WebsiteShortRepresentation } from '@app/common/models/website-short-representation/website-short-representation';

@Controller('api/sites')
export class SitesController
{
    //#region Services

    private readonly _siteManagementService: ISiteManagementService;

    //#endregion Services

    //#region Constructor

    constructor(
        @Inject(SiteManagementService)
        siteManagementService: SiteManagementService)
    {
        this._siteManagementService = siteManagementService;
    }

    //#endregion Constructor

    //#region Methods

    /**
     * METHOD Post
     * Creates a Website record for crawling
     * 
     * @param website - The website to be crawled
     * @returns The created Website record
     */
    @Post()
    public async createWebsite(@Body() website: WebsiteRecord): Promise<WebsiteRecord>
    {
        return await this._siteManagementService.createWebsiteRecord(website);
    }

    /**
     * METHOD Patch
     * Updates a Website record
     * 
     * @param website - The website to be updated
     * @returns The updated Website record
     */
    @Patch()
    public async updateWebsite(@Body() website: WebsiteRecord): Promise<WebsiteRecord>
    {
        return await this._siteManagementService.updateWebsiteRecord(website);
    }

    /**
     * METHOD Delete
     * Deletes a Website record
     * 
     * @param websiteId - The website id to be deleted
     */
    @Delete(':websiteId')
    public async deleteWebsite(@Param('websiteId') websiteId: string): Promise<string>
    {
        await this._siteManagementService.deleteWebsiteRecord(parseInt(websiteId));
        return `Website with id ${websiteId} has been deleted`;
    }

    /**
     * METHOD Get
     * Retrieves a Website record
     * 
     * @param websiteId - The website id to be retrieved
     * @returns The Website record
     */
    @Get(':websiteId')
    public async getWebsite(@Param('websiteId') websiteId: string): Promise<WebsiteRecord>
    {
        return await this._siteManagementService.getWebsiteRecord(parseInt(websiteId));
    }

    /**
     * METHOD Get
     * 
     * Retrieves paged list of Website records according to search params
     * 
     * @param searchParams - The search params
     * @returns The paged list of Website records
     */
    @Get()
    public async getPagedWebsites(@Query() searchParams: WebSitesPagedRequest): Promise<PagedResponse<WebsiteShortRepresentation>>
    {
        return await this._siteManagementService.getPagedWebsites(searchParams);
    }

    //#endregion Methods
}
