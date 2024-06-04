import { TagEntity } from "../../entities/tag-entity/tag-entity";

export class Tag 
{
    public id: number;
    public name: string;

    constructor(id: number, name: string)
    {
        this.id = id;
        this.name = name;
    }

    public static fromEntity(entity: TagEntity): Tag
    {
        const tag: Tag = new Tag(entity.id, entity.name);
        return tag;
    }
}
