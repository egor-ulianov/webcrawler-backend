import { ApiProperty } from '@nestjs/swagger';
import { PagedRequestBase } from '../paged-request-base/paged-request-base';

export class WebSitesPagedRequest extends PagedRequestBase {
  @ApiProperty()
  public url: string;

  @ApiProperty()
  public label: string;

  @ApiProperty()
  public tags: Array<string>;

  @ApiProperty()
  public orderColumn: string;

  @ApiProperty()
  public orderDirection: string;

  constructor(
    pageNumber: number,
    pageSize: number,
    url: string,
    label: string,
    tags: Array<string>,
    orderColumn: string,
    orderDirection: string,
  ) {
    super(pageNumber, pageSize);
    this.url = url;
    this.label = label;
    this.tags = tags;
    this.orderColumn = orderColumn;
    this.orderDirection = orderDirection;
  }
}
