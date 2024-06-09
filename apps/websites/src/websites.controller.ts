import { Controller, Get, Inject } from '@nestjs/common';
import { WebsitesService } from './websites.service';

@Controller()
export class WebsitesController {
  constructor(
    @Inject(WebsitesService)
    private readonly websitesService: WebsitesService,
  ) {}

  @Get()
  getHello(): string {
    return this.websitesService.getHello();
  }
}
