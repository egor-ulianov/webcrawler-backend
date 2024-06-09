import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TagEntity } from '../tag-entity/tag-entity';
import { WebsiteRecord } from '../../models/website-record/website-record';

@Entity('WebsiteRecord')
export class WebsiteRecordEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @Column()
  public label: string;

  @Column()
  public isActive: boolean;

  @Column()
  public boundaryRegExp: string;

  @Column()
  public periodicity: number;

  @ManyToMany(() => TagEntity, (tag) => tag.websites)
  @JoinTable({
    name: 'WebsiteRecordTag',
    joinColumn: {
      name: 'websiteRecordId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  public tags: Array<TagEntity>;

  public static fromModel(websiteRecord: WebsiteRecord): WebsiteRecordEntity {
    const entity: WebsiteRecordEntity = new WebsiteRecordEntity();
    entity.id = websiteRecord.id;
    entity.url = websiteRecord.url;
    entity.label = websiteRecord.label;
    entity.isActive = websiteRecord.isActive;
    entity.boundaryRegExp = websiteRecord.boundaryRegExp;
    entity.periodicity = websiteRecord.periodicity;
    entity.tags = websiteRecord.tags.map((tag) => TagEntity.fromModel(tag));
    return entity;
  }
}
