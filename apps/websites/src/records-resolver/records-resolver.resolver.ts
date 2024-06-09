import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { WebPageModel } from '../models/graphql/web-page-model/web-page-model';
import { NodeModel } from '../models/graphql/node-model/node-model';
import { Inject } from '@nestjs/common';
import { RecordObserverService } from '../business/record-observer/record-observer.service';
import { IRecordObserver } from '../business/record-observer/irecord-observer/irecord-observer.interface';
import { ISiteManagementService } from '../business/site-management/isite-management-service/isite-management-service.interface';
import { SiteManagementService } from '../business/site-management/site-management.service';

@Resolver(() => WebPageModel)
export class RecordsResolverResolver {
  private readonly _recordObserverService: IRecordObserver;
  private readonly _siteManagementService: ISiteManagementService;

  constructor(
    @Inject(RecordObserverService)
    recordObserverService: RecordObserverService,
    @Inject(SiteManagementService)
    siteManagementService: SiteManagementService,
  ) {
    this._recordObserverService = recordObserverService;
    this._siteManagementService = siteManagementService;
  }

  @Query(() => [WebPageModel])
  public async webPages(): Promise<WebPageModel[]> {
    return (await this._siteManagementService.getWebsiteRecords()).map(
      (record) => WebPageModel.fromControllerModel(record),
    );
  }

  @Query(() => [NodeModel])
  public async nodes(
    @Args('webPages', { type: () => [ID] }) webPages: number[],
  ) {
    return await this._recordObserverService.getRecordsFromSourceNodesAsGraph(
      webPages,
    );
  }
}
