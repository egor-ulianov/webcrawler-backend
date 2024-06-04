import { Controller, Post, Body, Patch, Delete, Param, Get, Inject } from '@nestjs/common';
import { ITagsManagementService } from '../../business/tags-management/itags-management-service/itags-management-service.interface';
import { TagsManagementService } from '../../business/tags-management/tags-management.service';
import { Tag } from '@app/common/models/tag/tag';

@Controller('tags')
export class TagsController
{
    //#region Services

    public tagsManagementService: ITagsManagementService;

    //#endregion Services

    //#region Constructor

    constructor(
        @Inject(TagsManagementService)
        tagsManagementService: TagsManagementService)
    {
        this.tagsManagementService = tagsManagementService;
    }

    //#endregion Constructor

    //#region Methods

    /**
     * METHOD Post
     * Creates a Tag
     * 
     * @param tag - The tag to be created
     * @returns The created Tag
     */
    @Post()
    public async createTag(@Body() tag: Tag): Promise<Tag>
    {
        return await this.tagsManagementService.createTag(tag);
    }

    /**
     * METHOD Patch
     * Updates a Tag
     * 
     * @param tag - The tag to be updated
     * @returns The updated Tag
     */
    @Patch()
    public async updateTag(@Body() tag: Tag): Promise<Tag>
    {
        return await this.tagsManagementService.updateTag(tag);
    }

    /**
     * METHOD Delete
     * Deletes a Tag
     * 
     * @param tagId - The tag id to be deleted
     */
    @Delete(':tagId')
    public async deleteTag(@Param('tagId') tagId: string): Promise<void>
    {
        await this.tagsManagementService.deleteTag(parseInt(tagId));
    }

    /**
     * METHOD Get
     * Gets a Tag
     * 
     * @param tagId - The tag id to be retrieved
     * @returns The retrieved Tag
     */
    @Get(':tagId')
    public async getTag(@Param('tagId') tagId: string): Promise<Tag>
    {
        return await this.tagsManagementService.getTag(parseInt(tagId));
    }

    /**
     * METHOD Get
     * Gets all Tags
     * 
     * @returns The retrieved Tags
     */
    @Get()
    public async getTags(): Promise<Tag[]>
    {
        return await this.tagsManagementService.getTags();
    }

    //#endregion Methods
}
