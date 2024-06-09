import { ApiProperty } from '@nestjs/swagger';

export class CrawlRecordsRequest {
  @ApiProperty()
  public sourceIds: Array<number>;
}
