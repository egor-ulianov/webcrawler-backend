import { ApiProperty } from '@nestjs/swagger';
import { WebsiteRecordEntity } from '../../entities/website-record-entity/website-record-entity';
import { Tag } from '../tag/tag';

export class WebsiteRecord {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public url: string;

  @ApiProperty()
  public label: string;

  @ApiProperty()
  public isActive: boolean;

  @ApiProperty()
  public boundaryRegExp: string;

  @ApiProperty()
  public periodicity: number;

  @ApiProperty()
  public tags: Array<Tag>;

  constructor(
    id: number,
    url: string,
    label: string,
    isActive: boolean,
    boundaryRegExp: string,
    periodicity: number,
    tags: Array<Tag>,
  ) {
    this.id = id;
    this.url = url;
    this.label = label;
    this.isActive = isActive;
    this.boundaryRegExp = boundaryRegExp;
    this.periodicity = periodicity;
    this.tags = tags;
  }

  public static fromEntity(entity: WebsiteRecordEntity): WebsiteRecord {
    const tags: Array<Tag> = entity.tags?.map((tag) => Tag.fromEntity(tag));
    const websiteRecord: WebsiteRecord = new WebsiteRecord(
      entity.id,
      entity.url,
      entity.label,
      entity.isActive,
      entity.boundaryRegExp,
      entity.periodicity,
      tags,
    );
    return websiteRecord;
  }
}
