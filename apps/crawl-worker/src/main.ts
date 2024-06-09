import { NestFactory } from '@nestjs/core';
import { workerData, parentPort } from 'worker_threads';
import { CrawlData } from '@app/common/models/crawl-data/crawl-data';
import { CrawlWorkerModule } from './crawl-worker.module';
import { CrawlerTask } from '@app/common/models/crawler-task/crawler-task';
import { CrawlWorkerService } from './crawl-worker.service';

console.log('Starting crawl-worker thread');

async function run() {
  const app = await NestFactory.createApplicationContext(CrawlWorkerModule);
  const crawlerService = app.get(CrawlWorkerService);

  const crawlData: CrawlerTask = workerData; // this is data received from main thread
  console.log(`Crawling websites ${crawlData.urls}`);

  const alreadyVisitedNodes: CrawlData[] = [];

  crawlData.urls.forEach(async (url) => {
    await crawlerService
      .crawlInnerNode(url, alreadyVisitedNodes, crawlData.initialNode)
      .then((result) => {
        console.log(result.length);
        parentPort.postMessage(result.length);
        process.exit(0);
      });
  });
}

run();
