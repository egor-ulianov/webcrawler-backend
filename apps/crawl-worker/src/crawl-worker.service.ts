import { CrawlData } from '@app/common/models/crawl-data/crawl-data';
import { WebsiteCrawlExecutionPlan } from '@app/common/models/website-crawl-execution-plan/website-crawl-execution-plan';
import * as cheerio from 'cheerio';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebsiteCrawlEntity } from '@app/common/entities/website-crawl-entity/website-crawl-entity';
import { Repository } from 'typeorm';

@Injectable()
export class CrawlWorkerService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(WebsiteCrawlEntity)
    private readonly _websiteCrawlEntityRepository: Repository<WebsiteCrawlEntity>,
  ) {}

  public async crawlInnerNode(
    url: string,
    alreadyVisitedNodes: CrawlData[],
    initialNode: WebsiteCrawlExecutionPlan,
    depth: number = 5,
  ): Promise<CrawlData[]> {
    if (depth === 0) {
      console.log(`Reached max depth for ${url}`);
      return alreadyVisitedNodes;
    }

    const baseUrl = CrawlWorkerService.removePathsFromUrl(
      initialNode.websiteRecord.url,
    );
    console.log(`Crawling ${url} in worker thread...`);

    url = this.prepareUrl(url, baseUrl, initialNode.websiteRecord.url);
    if (!url) return alreadyVisitedNodes;

    let response;
    try {
      response = await this.fetchPage(url);
    } catch (error) {
      console.error(`Failed to crawl ${url}, error: ${error.code}`);
    }

    if (!response || response.status !== 200) return alreadyVisitedNodes;

    const html = response.data;
    const $ = cheerio.load(html);
    const links = [];
    const boundaryLinks = [];
    const boundaryRegEx = new RegExp(initialNode.websiteRecord.boundaryRegExp);

    $('a').each((index, element) => {
      const link = $(element).attr('href');

      if (link) {
        const absoluteLink = this.prepareUrl(
          link,
          baseUrl,
          initialNode.websiteRecord.url,
        );
        links.push(absoluteLink);

        if (boundaryRegEx.test(link)) {
          boundaryLinks.push(absoluteLink);
        }
      }
    });

    console.log(
      `Found ${links.length} links on ${url} with id ${initialNode.websiteRecordId}`,
    );

    const crawlData: CrawlData = new CrawlData(
      initialNode.websiteRecordId,
      url,
      new Date(),
      $('title').text(),
      links,
    );
    alreadyVisitedNodes.push(crawlData);

    // Store the crawl data
    await this._websiteCrawlEntityRepository.upsert(
      WebsiteCrawlEntity.fromModel(crawlData),
      ['url', 'websiteRecordId'],
    );

    await this.crawlNewLinks(
      boundaryLinks,
      alreadyVisitedNodes,
      initialNode,
      depth,
      url,
    );

    console.log(`Crawled ${url}`);
    return alreadyVisitedNodes;
  }

  private prepareUrl(url: string, baseUrl: string, initialUrl: string): string {
    if (url.startsWith('/')) {
      return baseUrl + url;
    } else if (url.startsWith('.')) {
      return initialUrl + url.replace('./', '');
    } else {
      return url;
    }
  }

  private async fetchPage(url: string) {
    return await firstValueFrom(this.httpService.get(url, { timeout: 5000 }));
  }

  private extractLinks(
    response: any,
    baseUrl: string,
    boundaryRegExp: string,
  ): string[] {
    const html = response.data;
    const $ = cheerio.load(html);
    const links = [];
    const boundaryRegEx = new RegExp(boundaryRegExp);

    $('a').each((index, element) => {
      const link = $(element).attr('href');
      if (link && boundaryRegEx.test(link)) {
        const absoluteLink = link.startsWith('/')
          ? new URL(link, baseUrl).toString()
          : link;
        links.push(absoluteLink);
      }
    });

    return links;
  }

  private async crawlNewLinks(
    links: string[],
    alreadyVisitedNodes: CrawlData[],
    initialNode: WebsiteCrawlExecutionPlan,
    depth: number,
    url: string,
  ) {
    for (const link of links) {
      if (
        link !== url &&
        !alreadyVisitedNodes.some((node) => node.url === link) &&
        link !== initialNode.websiteRecord.url
      ) {
        console.log(`Init ${link} in worker thread...`);
        await this.crawlInnerNode(
          link,
          alreadyVisitedNodes,
          initialNode,
          depth - 1,
        );
      }
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
