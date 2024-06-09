import { WebsiteRecord } from '@app/common/models/website-record/website-record';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('WebPage')
export class WebPageModel {
  @Field(() => ID)
  identifier: number;

  @Field()
  label: string;

  @Field()
  url: string;

  @Field()
  regexp: string;

  @Field(() => [String])
  tags: string[];

  @Field()
  active: boolean;

  public static fromControllerModel(model: WebsiteRecord): WebPageModel {
    const webPage: WebPageModel = new WebPageModel();
    webPage.identifier = model.id;
    webPage.label = model.label;
    webPage.url = model.url;
    webPage.regexp = model.boundaryRegExp;
    webPage.tags = model.tags.map((tag) => tag.name);
    webPage.active = model.isActive;
    return webPage;
  }
}
