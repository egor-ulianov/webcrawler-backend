import { Module } from '@nestjs/common';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitesController } from './controllers/sites/sites.controller';
import { TagsController } from './controllers/tags/tags.controller';
import { SiteManagementService } from './business/site-management/site-management.service';
import { TagsManagementService } from './business/tags-management/tags-management.service';
import { ConfigModule } from '@nestjs/config';
import { TagEntity } from '@app/common/entities/tag-entity/tag-entity';
import { WebsiteRecordEntity } from '@app/common/entities/website-record-entity/website-record-entity';
import { WebsiteCrawlExecutionPlanView } from '@app/common/entities/views/website-crawl-execution-plan-view/website-crawl-execution-plan-view';
import { WebsiteCrawlExecutionPlanEntity } from '@app/common/entities/website-crawl-execution-plan-entity/website-crawl-execution-plan-entity';
import { ExecutionsController } from './controllers/executions/executions.controller';
import { ExecutionManagementService } from './business/execution-management/execution-management.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
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
        entities: [TagEntity, WebsiteRecordEntity, WebsiteCrawlExecutionPlanView, WebsiteCrawlExecutionPlanEntity],
      }),
      TypeOrmModule.forFeature([TagEntity, WebsiteRecordEntity, WebsiteCrawlExecutionPlanView, WebsiteCrawlExecutionPlanEntity]),
  ],
  controllers: [SitesController, TagsController, WebsitesController, ExecutionsController],
  providers: [SiteManagementService, TagsManagementService, WebsitesService, ExecutionManagementService],
})
export class WebsitesModule {}
