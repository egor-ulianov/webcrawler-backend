import { CrawlData } from '@app/common/models/crawl-data/crawl-data';
import { WebsiteCrawlExecutionPlan } from '@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan';
import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as cheerio from 'cheerio';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CrawlerService
{
    constructor(private readonly httpService: HttpService) {}

    public async crawlInnerNode(url: string, alreadyVisitedNodes: CrawlData[], initialNode: WebsiteCrawlExecutionPlan): Promise<CrawlData[]>
    {
        const response = await firstValueFrom(this.httpService.get(url));
        const html = response.data;
        const $ = cheerio.load(html);
        const links = [];
        const boundaryRegExp = new RegExp(initialNode.websiteRecord.boundaryRegExp);

        $('a').each((index, element) => {
            const link = $(element).attr('href');
            if (boundaryRegExp.test(link)) {
                links.push(link);
            }
        });

        const crawlData: CrawlData = new CrawlData(initialNode.websiteRecordId, url, new Date(), $('title').text(), links);
        alreadyVisitedNodes.push(crawlData);

        console.log(`Found ${links.length} links on ${url}`);

        for (const link of links) {
            if (link !== url && !alreadyVisitedNodes.some(node => node.url === link)) {
                await this.crawlInnerNode(link, alreadyVisitedNodes, initialNode);
            }
        }

        console.log(`Crawled ${url}`);

        return alreadyVisitedNodes;
    }
    
}
