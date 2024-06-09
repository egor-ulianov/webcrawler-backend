import { Field, ObjectType } from '@nestjs/graphql';
import { WebPageModel } from '../web-page-model/web-page-model';
import { CrawlData } from '@app/common/models/crawl-data/crawl-data';

@ObjectType('Node')
export class NodeModel {
  @Field({ nullable: true })
  title?: string;

  @Field()
  url: string;

  @Field({ nullable: true })
  crawlTime?: string;

  @Field(() => [NodeModel])
  links: NodeModel[];

  @Field(() => WebPageModel)
  owner: WebPageModel;

  linkStrings: string[];

  ownerId: number;

  public static fromControllerModel(model: CrawlData): NodeModel {
    const node: NodeModel = new NodeModel();
    node.title = model.title;
    node.url = model.url;
    node.crawlTime = model.crawlTime.toISOString();
    node.linkStrings = model.links;
    node.ownerId = model.startingNodeId;
    return node;
  }
}
