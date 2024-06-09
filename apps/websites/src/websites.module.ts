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
import { WebsiteCrawlEntity } from '@app/common/entities/website-crawl-entity/website-crawl-entity';
import { RecordsController } from './controllers/records/records.controller';
import { RecordObserverService } from './business/record-observer/record-observer.service';
import { RecordsResolverResolver } from './records-resolver/records-resolver.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: true,
      path: 'api/graphql',
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as any,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT as any,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      entities: [
        WebsiteCrawlEntity,
        TagEntity,
        WebsiteRecordEntity,
        WebsiteCrawlExecutionPlanView,
        WebsiteCrawlExecutionPlanEntity,
      ],
    }),
    TypeOrmModule.forFeature([
      WebsiteCrawlEntity,
      TagEntity,
      WebsiteRecordEntity,
      WebsiteCrawlExecutionPlanView,
      WebsiteCrawlExecutionPlanEntity,
    ]),
  ],
  controllers: [
    SitesController,
    TagsController,
    WebsitesController,
    ExecutionsController,
    RecordsController,
  ],
  providers: [
    SiteManagementService,
    TagsManagementService,
    WebsitesService,
    ExecutionManagementService,
    RecordObserverService,
    RecordsResolverResolver,
  ],
})
export class WebsitesModule {}
