import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Get,
  Inject,
} from '@nestjs/common';
import { ITagsManagementService } from '../../business/tags-management/itags-management-service/itags-management-service.interface';
import { TagsManagementService } from '../../business/tags-management/tags-management.service';
import { Tag } from '@app/common/models/tag/tag';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/tags')
export class TagsController {
  //#region Services

  public tagsManagementService: ITagsManagementService;

  //#endregion Services

  //#region Constructor

  constructor(
    @Inject(TagsManagementService)
    tagsManagementService: TagsManagementService,
  ) {
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
  @ApiOperation({ summary: 'Creates a Tag' })
  @ApiResponse({ status: 201, description: 'The created Tag' })
  @ApiBody({ type: Tag })
  public async createTag(@Body() tag: Tag): Promise<Tag> {
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
  @ApiOperation({ summary: 'Updates a Tag' })
  @ApiResponse({ status: 200, description: 'The updated Tag' })
  @ApiBody({ type: Tag })
  public async updateTag(@Body() tag: Tag): Promise<Tag> {
    return await this.tagsManagementService.updateTag(tag);
  }

  /**
   * METHOD Delete
   * Deletes a Tag
   *
   * @param tagId - The tag id to be deleted
   */
  @Delete(':tagId')
  @ApiOperation({ summary: 'Deletes a Tag' })
  @ApiResponse({ status: 204, description: 'The Tag was deleted' })
  public async deleteTag(@Param('tagId') tagId: string): Promise<void> {
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
  @ApiOperation({ summary: 'Gets a Tag' })
  @ApiResponse({ status: 200, description: 'The retrieved Tag' })
  public async getTag(@Param('tagId') tagId: string): Promise<Tag> {
    return await this.tagsManagementService.getTag(parseInt(tagId));
  }

  /**
   * METHOD Get
   * Gets all Tags
   *
   * @returns The retrieved Tags
   */
  @Get()
  @ApiOperation({ summary: 'Gets all Tags' })
  @ApiResponse({ status: 200, description: 'The retrieved Tags' })
  public async getTags(): Promise<Tag[]> {
    return await this.tagsManagementService.getTags();
  }

  //#endregion Methods
}
