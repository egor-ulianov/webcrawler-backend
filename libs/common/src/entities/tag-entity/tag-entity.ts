import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WebsiteRecordEntity } from '../website-record-entity/website-record-entity';
import { Tag } from '../../models/tag/tag';

@Entity('Tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public name: string;

  @ManyToMany(() => WebsiteRecordEntity, (website) => website.tags)
  @JoinTable({
    name: 'WebsiteRecordTag',
    joinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'websiteRecordId',
      referencedColumnName: 'id',
    },
  })
  public websites: Array<WebsiteRecordEntity>;

  public static fromModel(tag: Tag): TagEntity {
    const entity: TagEntity = new TagEntity();
    entity.id = tag.id;
    entity.name = tag.name;
    return entity;
  }
}
