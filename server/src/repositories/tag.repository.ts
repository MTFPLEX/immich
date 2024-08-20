import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Chunked, ChunkedSet, DummyValue, GenerateSql } from 'src/decorators';
import { TagEntity } from 'src/entities/tag.entity';
import { ITagRepository } from 'src/interfaces/tag.interface';
import { Instrumentation } from 'src/utils/instrumentation';
import { DataSource, In, IsNull, Repository, TreeRepository } from 'typeorm';

@Instrumentation()
@Injectable()
export class TagRepository implements ITagRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(TagEntity) private repository: Repository<TagEntity>,
    @InjectRepository(TagEntity) private tree: TreeRepository<TagEntity>,
  ) {}

  async get(id: string): Promise<TagEntity | null> {
    const tag = await this.repository.findOne({ where: { id } });
    return this.withAncestors(tag);
  }

  getByNameAndParent(userId: string, options: { name: string; parentId?: string }): Promise<TagEntity | null> {
    return this.repository.findOne({
      relations: {
        parent: true,
      },
      where: {
        userId,
        name: options.name,
        parent: { id: options.parentId ?? IsNull() },
      },
    });
  }

  async getAll(userId: string): Promise<TagEntity[]> {
    const cache: Record<string, TagEntity> = {};

    const tags = await this.repository.find({
      where: { userId },
      relations: {
        parent: true,
      },
      order: {
        name: 'ASC',
      },
    });

    for (const tag of tags) {
      cache[tag.id] = tag;
    }

    for (const tag of tags) {
      if (tag.parent) {
        tag.parent = cache[tag.parent.id];
      }
    }

    return tags;
  }

  create(tag: Partial<TagEntity>): Promise<TagEntity> {
    return this.save(tag);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  @GenerateSql({ params: [DummyValue.UUID, [DummyValue.UUID]] })
  @ChunkedSet({ paramIndex: 1 })
  async getAssetIds(tagId: string, assetIds: string[]): Promise<Set<string>> {
    if (assetIds.length === 0) {
      return new Set();
    }

    const results = await this.dataSource
      .createQueryBuilder()
      .select('tag_asset.assetsId', 'assetId')
      .from('tag_asset', 'tag_asset')
      .where('"tag_asset"."tagsId" = :tagId', { tagId })
      .andWhere('"tag_asset"."assetsId" IN (:...assetIds)', { assetIds })
      .getRawMany<{ assetId: string }>();

    return new Set(results.map(({ assetId }) => assetId));
  }

  @GenerateSql({ params: [DummyValue.UUID, [DummyValue.UUID]] })
  async addAssetIds(tagId: string, assetIds: string[]): Promise<void> {
    if (assetIds.length === 0) {
      return;
    }

    await this.dataSource.manager
      .createQueryBuilder()
      .insert()
      .into('tag_asset', ['tagsId', 'assetsId'])
      .values(assetIds.map((assetId) => ({ tagsId: tagId, assetsId: assetId })))
      .execute();
  }

  @GenerateSql({ params: [DummyValue.UUID, [DummyValue.UUID]] })
  @Chunked({ paramIndex: 1 })
  async removeAssetIds(tagId: string, assetIds: string[]): Promise<void> {
    if (assetIds.length === 0) {
      return;
    }

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('tag_asset')
      .where({
        tagsId: tagId,
        assetsId: In(assetIds),
      })
      .execute();
  }

  async upsertAssetTags({ assetId, tagIds }: { assetId: string; tagIds: string[] }) {
    await this.dataSource.transaction(async (manager) => {
      await manager.createQueryBuilder().delete().from('tag_asset').where({ assetsId: assetId }).execute();

      if (tagIds.length === 0) {
        return;
      }

      await manager
        .createQueryBuilder()
        .insert()
        .into('tag_asset', ['tagsId', 'assetsId'])
        .values(tagIds.map((tagId) => ({ tagsId: tagId, assetsId: assetId })))
        .execute();
    });
  }

  private async save(partial: Partial<TagEntity>): Promise<TagEntity> {
    const { id } = await this.repository.save(partial);
    const tag = await this.repository.findOneOrFail({ where: { id } });
    return this.withAncestors(tag);
  }

  private async withAncestors<T extends TagEntity | null>(tag: T): Promise<T> {
    if (tag) {
      const ancestors = await this.tree.findAncestorsTree({ id: tag.id } as TagEntity);
      tag.parent = ancestors.parent;
    }

    return tag;
  }
}
