import { Module } from '@nestjs/common';
import { CrawlWorkerService } from './crawl-worker.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteCrawlEntity } from '@app/common/entities/website-crawl-entity/website-crawl-entity';
import { TagEntity } from '@app/common/entities/tag-entity/tag-entity';
import { WebsiteCrawlExecutionPlanView } from '@app/common/entities/views/website-crawl-execution-plan-view/website-crawl-execution-plan-view';
import { WebsiteCrawlExecutionPlanEntity } from '@app/common/entities/website-crawl-execution-plan-entity/website-crawl-execution-plan-entity';
import { WebsiteRecordEntity } from '@app/common/entities/website-record-entity/website-record-entity';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';

@Module({
  imports: [HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    RmqModule.register({ 
      name: 'CRAWLEXECUTOR' 
    }),
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
      TypeOrmModule.forFeature([TagEntity, WebsiteRecordEntity, WebsiteCrawlExecutionPlanView, WebsiteCrawlExecutionPlanEntity, WebsiteCrawlEntity])],
  providers: [CrawlWorkerService],
})
export class CrawlWorkerModule {}
