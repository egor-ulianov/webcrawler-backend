import { CrawlData } from '@app/common/models/crawl-data/crawl-data';
import { NodeModel } from 'apps/websites/src/models/graphql/node-model/node-model';

export interface IRecordObserver {
  getRecordsFromSourceNodes(
    sourceNodes: Array<number>,
  ): Promise<Array<CrawlData>>;

  getRecordsFromSourceNodesAsGraph(
    sourceNodes: Array<number>,
  ): Promise<Array<NodeModel>>;
}
