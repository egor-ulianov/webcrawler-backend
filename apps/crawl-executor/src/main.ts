import { NestFactory } from '@nestjs/core';
import { CrawlExecutorModule } from './crawl-executor.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(CrawlExecutorModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('crawlexecutor'));
  console.log(
    'Starting crawl-executor microservice with options: ' +
      JSON.stringify(rmqService.getOptions('crawlexecutor')),
  );
  await app.startAllMicroservices();
}
bootstrap();
