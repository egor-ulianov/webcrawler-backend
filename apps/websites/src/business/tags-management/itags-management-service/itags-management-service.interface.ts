import { Tag } from "@app/common/models/tag/tag";


export interface ITagsManagementService 
{
    // public async createTag(tag: Tag): Promise<Tag>;
    createTag(tag: Tag): Promise<Tag>;

    // public async updateTag(tag: Tag): Promise<Tag>;
    updateTag(tag: Tag): Promise<Tag>;

    // public async deleteTag(tagId: number): Promise<void>;
    deleteTag(tagId: number): Promise<void>;

    // public async getTag(tagId: number): Promise<Tag>;
    getTag(tagId: number): Promise<Tag>;

    // public async getTags(): Promise<Array<Tag>>;
    getTags(): Promise<Array<Tag>>;
}
