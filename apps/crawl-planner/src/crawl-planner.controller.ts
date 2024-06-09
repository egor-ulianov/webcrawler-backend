import { Controller, Get, Inject } from '@nestjs/common';
import { CrawlPlannerService } from './crawl-planner.service';

@Controller()
export class CrawlPlannerController {
  constructor(
    @Inject(CrawlPlannerService)
    private readonly websitesService: CrawlPlannerService,
  ) {}

  @Get()
  getHello(): string {
    return this.websitesService.getHello();
  }
}
