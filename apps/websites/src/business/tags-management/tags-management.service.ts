import { Injectable } from '@nestjs/common';
import { ITagsManagementService } from './itags-management-service/itags-management-service.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '@app/common/entities/tag-entity/tag-entity';
import { Tag } from '@app/common/models/tag/tag';

@Injectable()
export class TagsManagementService implements ITagsManagementService 
{
    constructor(@InjectRepository(TagEntity) private _tagRepository: Repository<TagEntity>)
    {   }

    public async createTag(tag: Tag): Promise<Tag> {
        return await this._tagRepository.save(TagEntity.fromModel(tag));
    }

    public async updateTag(tag: Tag): Promise<Tag> {
        return await this._tagRepository.save(TagEntity.fromModel(tag));
    }

    public async deleteTag(tagId: number): Promise<void> {
        await this._tagRepository.delete(tagId);
    }

    public async getTag(tagId: number): Promise<Tag> {
        return Tag.fromEntity(await this._tagRepository.findOne({ where: { id: tagId } }));
    }

    public async getTags(): Promise<Tag[]> {
        return (await this._tagRepository.find()).map(tag => Tag.fromEntity(tag));
    }
    
}
