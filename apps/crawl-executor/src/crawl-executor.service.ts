import { WebsiteCrawlExecutionPlan } from '@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan';
import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as cheerio from 'cheerio';
import workerThreadFilePath from './worker-threads/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CrawlerTask } from '@app/common/models/crawler-task/crawler-task';
import { InjectRepository } from '@nestjs/typeorm';
import { WebsiteCrawlEntity } from '@app/common/entities/website-crawl-entity/website-crawl-entity';
import { Repository } from 'typeorm';
import { WebsiteCrawlExecutionPlanEntity } from '@app/common/entities/website-crawl-execution-plan-entity/website-crawl-execution-plan-entity';
import * as os from 'node:os';

@Injectable()
export class CrawlExecutorService {
  private readonly _workers: { [key: number]: Worker[] } = {};
  private readonly _taskFinishedWorkers: { [key: number]: number } = {};
  private readonly _taskNumCrawledPages: { [key: number]: number } = {};

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(WebsiteCrawlEntity)
    private readonly _websiteCrawlEntityRepository: Repository<WebsiteCrawlEntity>,
    @InjectRepository(WebsiteCrawlExecutionPlanEntity)
    private readonly _websiteCrawlExecutionPlanEntityRepository: Repository<WebsiteCrawlExecutionPlanEntity>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  public async crawlWebsite(website: WebsiteCrawlExecutionPlan): Promise<void> {
    await this.executeCrawl(website);
  }

  private async executeCrawl(
    website: WebsiteCrawlExecutionPlan,
  ): Promise<void> {
    console.log(`Crawling website ${website.websiteRecord.url}`);

    await this._websiteCrawlExecutionPlanEntityRepository.update(website.id, {
      state: 'Running',
    });

    // Download the website
    const response = await firstValueFrom(
      this.httpService.get(website.websiteRecord.url),
    );

    if (response.status !== 200) {
      console.error(`Failed to crawl ${website.websiteRecord.url}`);
      await this._websiteCrawlExecutionPlanEntityRepository.update(website.id, {
        state: 'Failed',
      });
      return;
    }

    //Removing old crawl data
    await this._websiteCrawlEntityRepository.delete({
      websiteRecordId: website.websiteRecord.id,
    });

    const html = response.data;

    // Parse the HTML
    const $ = cheerio.load(html);

    const boundaryRegExp = new RegExp(website.websiteRecord.boundaryRegExp);

    // Find the title and links
    const title = $('title').text();
    const links = [];
    const boundaryLinks = [];
    $('a').each((index, element) => {
      const link = $(element).attr('href');
      if (!link) return;

      links.push(link);
      if (boundaryRegExp.test(link)) {
        boundaryLinks.push(link);
      }
    });

    const baseUrl = CrawlExecutorService.removePathsFromUrl(
      website.websiteRecord.url,
    );

    // Create a record
    const record = {
      websiteRecordId: website.websiteRecord.id,
      url: website.websiteRecord.url,
      crawlTime: new Date(),
      title,
      outgoingUrls: links.map((link) =>
        this.prepareUrl(link, baseUrl, website.websiteRecord.url),
      ),
    };

    // Save the record
    await this._websiteCrawlEntityRepository.save(record);

    console.log(record);
    console.log(
      'Number of added workers: ' + Object.keys(this._workers).length,
    );

    // Generate process guid
    const taskGuid = Math.floor(Math.random() * 1000000);
    console.log(`Task guid: ${taskGuid}`);

    const numProcessors = os.cpus().length;
    console.log(`Number of processors: ${numProcessors}`);

    // Crawl each link that matches the boundary RegExp
    const dividedLinks: string[][] = this.divideLinks(
      boundaryLinks,
      numProcessors,
    );
    for (const linkChunk of dividedLinks) {
      console.log(
        `Crawling ${linkChunk.length} links in ${numProcessors} processors`,
      );
      this.crawlInWorker(
        new CrawlerTask(linkChunk, website),
        taskGuid,
        dividedLinks.length,
        boundaryLinks.length,
      );
    }
  }

  private divideLinks(links: string[], numProcessors: number): string[][] {
    const partSize = Math.ceil(links.length / numProcessors);
    const parts = [];

    for (let i = 0; i < links.length; i += partSize) {
      const part = links.slice(i, i + partSize);
      parts.push(part);
    }

    console.log(`Divided links into ${parts.length} parts`);

    return parts;
  }

  private crawlInWorker(
    website: CrawlerTask,
    taskId: number,
    numProcessors: number,
    numInitialLinks: number,
  ): Worker {
    console.log(`Working with ${website.urls.length} links in worker thread`);
    const worker = new Worker(workerThreadFilePath, {
      workerData: website,
    });

    this._workers[taskId] = this._workers[taskId] || [];
    this._workers[taskId].push(worker);

    worker.on('message', (message) => {
      console.log(`Worker message: ${message}`);
      this._taskNumCrawledPages[taskId] = message;
    });

    worker.on('error', (error) => {
      console.error(`Worker error: ${error}`);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
      console.log('Worker stopped');
      this._taskFinishedWorkers[taskId] =
        this._taskFinishedWorkers[taskId] || 0;
      this._taskFinishedWorkers[taskId]++;

      console.log(
        `Task finished workers: ${this._taskFinishedWorkers[taskId]} / ${numProcessors}`,
      );
      if (this._taskFinishedWorkers[taskId] === numProcessors) {
        console.log('All workers finished');
        this._workers[taskId].forEach((worker) => worker.terminate());

        this._websiteCrawlExecutionPlanEntityRepository.update(
          website.initialNode.id,
          {
            state: 'Completed',
            finishedDate: new Date(),
            numberOfCrawledPages:
              this._taskNumCrawledPages[taskId] + numInitialLinks,
          },
        );

        delete this._workers[taskId];
        delete this._taskFinishedWorkers[taskId];
        delete this._taskNumCrawledPages[taskId];
      }
    });

    return worker;
  }

  private prepareUrl(url: string, baseUrl: string, initialUrl: string): string {
    console.log(`Preparing URL: ${url}`);
    if (url.startsWith('/')) {
      return baseUrl + url;
    } else if (url.startsWith('.')) {
      return initialUrl + url.replace('./', '');
    } else {
      return url;
    }
  }

  private static removePathsFromUrl(url: string): string {
    const urlObj = new URL(url);
    return (
      urlObj.protocol +
      '//' +
      urlObj.hostname +
      (urlObj.port ? ':' + urlObj.port : '')
    );
  }
}
