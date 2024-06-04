import { Module } from '@nestjs/common';
import { CrawlExecutorController } from './crawl-executor.controller';
import { CrawlExecutorService } from './crawl-executor.service';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteCrawlEntity } from '@app/common/entities/website-crawl-entity/website-crawl-entity';
import { TagEntity } from '@app/common/entities/tag-entity/tag-entity';
import { WebsiteCrawlExecutionPlanView } from '@app/common/entities/views/website-crawl-execution-plan-view/website-crawl-execution-plan-view';
import { WebsiteCrawlExecutionPlanEntity } from '@app/common/entities/website-crawl-execution-plan-entity/website-crawl-execution-plan-entity';
import { WebsiteRecordEntity } from '@app/common/entities/website-record-entity/website-record-entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    RmqModule,
    HttpModule,
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: 'database',
        port: 5432,
        username: 'webcrawler_user',
        password: 'webcrawlerpasswd',
        database: 'webcrawler_db',
        synchronize: true,
        entities: [TagEntity, WebsiteRecordEntity, WebsiteCrawlExecutionPlanView, WebsiteCrawlExecutionPlanEntity, WebsiteCrawlEntity],
      }),
      TypeOrmModule.forFeature([TagEntity, WebsiteRecordEntity, WebsiteCrawlExecutionPlanView, WebsiteCrawlExecutionPlanEntity, WebsiteCrawlEntity])
    ],
  controllers: [CrawlExecutorController],
  providers: [CrawlExecutorService],
})
export class CrawlExecutorModule {}
