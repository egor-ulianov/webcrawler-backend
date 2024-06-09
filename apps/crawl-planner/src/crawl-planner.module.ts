import { Module } from '@nestjs/common';
import { CrawlPlannerService } from './crawl-planner.service';
import { RmqModule } from '@app/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '@app/common/entities/tag-entity/tag-entity';
import { WebsiteRecordEntity } from '@app/common/entities/website-record-entity/website-record-entity';
import { WebsiteCrawlExecutionPlanView } from '@app/common/entities/views/website-crawl-execution-plan-view/website-crawl-execution-plan-view';
import { WebsiteCrawlExecutionPlanEntity } from '@app/common/entities/website-crawl-execution-plan-entity/website-crawl-execution-plan-entity';
import { ConfigModule } from '@nestjs/config';
import { CrawlPlannerController } from './crawl-planner.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    RmqModule.register({
      name: 'CRAWLEXECUTOR',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'webcrawler_user',
      password: 'webcrawlerpasswd',
      database: 'webcrawler_db',
      synchronize: true,
      entities: [
        TagEntity,
        WebsiteRecordEntity,
        WebsiteCrawlExecutionPlanView,
        WebsiteCrawlExecutionPlanEntity,
      ],
    }),
    TypeOrmModule.forFeature([
      TagEntity,
      WebsiteRecordEntity,
      WebsiteCrawlExecutionPlanView,
      WebsiteCrawlExecutionPlanEntity,
    ]),
  ],
  providers: [CrawlPlannerService],
  controllers: [CrawlPlannerController],
})
export class CrawlPlannerModule {}
