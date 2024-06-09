import { ApiProperty } from '@nestjs/swagger';

export abstract class PagedRequestBase {
  @ApiProperty()
  public pageNumber: number;

  @ApiProperty()
  public pageSize: number;

  constructor(pageNumber: number, pageSize: number) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }
}
