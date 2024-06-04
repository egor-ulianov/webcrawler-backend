import { NestFactory } from '@nestjs/core';
import { CrawlPlannerModule } from './crawl-planner.module';

async function bootstrap() {
  const app = await NestFactory.create(CrawlPlannerModule);
  await app.listen(3010);
}
bootstrap();
