import { PagedRequestBase } from "../paged-request-base/paged-request-base";

export class WebSitesPagedRequest extends PagedRequestBase 
{
    public url: string;

    public label: string;

    public tags: Array<string>;

    public orderColumn: string;

    public orderDirection: string;

    constructor(pageNumber: number, 
        pageSize: number, 
        url: string, 
        label: string, 
        tags: Array<string>,
        orderColumn: string,
        orderDirection: string)
    {
        super(pageNumber, pageSize);
        this.url = url;
        this.label = label;
        this.tags = tags;
        this.orderColumn = orderColumn;
        this.orderDirection = orderDirection;
    }
}
