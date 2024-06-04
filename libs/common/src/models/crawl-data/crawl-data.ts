export class CrawlData
{
    public startingNodeId: number;

    public url: string;

    public crawlTime: Date;

    public title: string;

    public links: string[];

    constructor(startingNodeId: number, url: string, crawlTime: Date, title: string, links: string[])
    {
        this.startingNodeId = startingNodeId;
        this.url = url;
        this.crawlTime = crawlTime;
        this.title = title;
        this.links = links;
    }
}
