export class PagedResponse<T> 
{
    public pageNumber: number;
    public pageSize: number;
    public totalRecords: number;
    public totalPages: number;
    public data: Array<T>;

    constructor(pageNumber: number, pageSize: number, totalRecords: number, totalPages: number, data: Array<T>)
    {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalRecords = totalRecords;
        this.totalPages = totalPages;
        this.data = data;
    }
}
