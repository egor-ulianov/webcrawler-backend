import { Controller, Get, Inject, Query } from '@nestjs/common';
import { IRecordObserver } from '../../business/record-observer/irecord-observer/irecord-observer.interface';
import { RecordObserverService } from '../../business/record-observer/record-observer.service';
import { CrawlRecordsRequest } from '../../models/request-models/crawl-records-request/crawl-records-request';
import { CrawlData } from '@app/common/models/crawl-data/crawl-data';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('api/records')
export class RecordsController {
  private readonly _recordObserverService: IRecordObserver;

  constructor(
    @Inject(RecordObserverService)
    recordObserverService: RecordObserverService,
  ) {
    this._recordObserverService = recordObserverService;
  }

  /**
   * METHOD Get
   * Gets records from source nodes
   *
   * @param sourceNodes - The source nodes
   */
  @Get()
  @ApiOperation({ summary: 'Gets records from source nodes' })
  @ApiResponse({ status: 200, description: 'The records from source nodes' })
  @ApiQuery({ type: CrawlRecordsRequest })
  public async getRecordsFromSourceNodes(
    @Query() sourceNodes: CrawlRecordsRequest,
  ): Promise<Array<CrawlData>> {
    return await this._recordObserverService.getRecordsFromSourceNodes(
      sourceNodes.sourceIds,
    );
  }
}
