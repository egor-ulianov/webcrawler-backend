import { Controller, Get } from '@nestjs/common';
import { CrawlExecutorService } from './crawl-executor.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WebsiteCrawlExecutionPlan } from '@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan';

@Controller()
export class CrawlExecutorController {
  constructor(private readonly crawlExecutorService: CrawlExecutorService) {}

  @Get()
  getHello(): string {
    return this.crawlExecutorService.getHello();
  }

  @EventPattern('crawl')
  public async crawl(
    @Payload() data: WebsiteCrawlExecutionPlan,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
    await this.crawlExecutorService.crawlWebsite(data);
  }
}
