import { NestFactory } from '@nestjs/core';
import { WebsitesModule } from './websites.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(WebsitesModule);

  const config = new DocumentBuilder()
    .setTitle('Web Crawler Websites API')
    .setDescription('The Web Crawler API description')
    .setVersion('1.0')
    .addTag('websites')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(3000);
}
bootstrap();
