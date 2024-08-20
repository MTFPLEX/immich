import { TagEntity } from 'src/entities/tag.entity';
import { IBulkAsset } from 'src/utils/asset.util';

export const ITagRepository = 'ITagRepository';

export interface ITagRepository extends IBulkAsset {
  getAll(userId: string): Promise<TagEntity[]>;
  getByNameAndParent(userId: string, options: { name: string; parentId?: string }): Promise<TagEntity | null>;

  create(tag: Partial<TagEntity>): Promise<TagEntity>;
  get(id: string): Promise<TagEntity | null>;
  delete(id: string): Promise<void>;

  upsertAssetTags({ assetId, tagIds }: { assetId: string; tagIds: string[] }): Promise<void>;
}
