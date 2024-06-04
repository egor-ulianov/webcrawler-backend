import { NestFactory } from '@nestjs/core';
import { WebsitesModule } from './websites.module';

async function bootstrap() {
  const app = await NestFactory.create(WebsitesModule);
  await app.listen(3000);
}
bootstrap();
