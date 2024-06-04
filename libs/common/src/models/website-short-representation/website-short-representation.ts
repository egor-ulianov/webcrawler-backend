import { WebsiteCrawlExecutionPlanView } from "../../entities/views/website-crawl-execution-plan-view/website-crawl-execution-plan-view";

export class WebsiteShortRepresentation 
{
    public label: string;

    public siteId: number;

    public url: string;

    public isActive: boolean;

    public periodicity: number;

    public tags: string[];

    public date: Date;

    public state: string;

    constructor(label: string, siteId: number, url: string, isActive: boolean, periodicity: number, tags: string[], date: Date, state: string)
    {
        this.label = label;
        this.url = url;
        this.isActive = isActive;
        this.periodicity = periodicity;
        this.tags = tags;
        this.date = date;
        this.state = state;
    }

    public static fromEntity(entity: WebsiteCrawlExecutionPlanView): WebsiteShortRepresentation
    {
        const websiteShortRepresentation: WebsiteShortRepresentation = 
            new WebsiteShortRepresentation(entity.label,
                                            entity.siteId,
                                            entity.url,
                                            entity.isActive,
                                            entity.periodicity, 
                                            entity.tags,
                                            entity.date,
                                            entity.state);
        return websiteShortRepresentation;
    }

}
