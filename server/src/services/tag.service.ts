import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BulkIdResponseDto, BulkIdsDto } from 'src/dtos/asset-ids.response.dto';
import { AuthDto } from 'src/dtos/auth.dto';
import { TagCreateDto, TagResponseDto, TagUpsertDto, mapTag } from 'src/dtos/tag.dto';
import { TagEntity } from 'src/entities/tag.entity';
import { Permission } from 'src/enum';
import { IAccessRepository } from 'src/interfaces/access.interface';
import { ITagRepository } from 'src/interfaces/tag.interface';
import { requireAccess } from 'src/utils/access';
import { addAssets, removeAssets } from 'src/utils/asset.util';
import { upsertTags } from 'src/utils/tag';

@Injectable()
export class TagService {
  constructor(
    @Inject(IAccessRepository) private access: IAccessRepository,
    @Inject(ITagRepository) private repository: ITagRepository,
  ) {}

  async getAll(auth: AuthDto) {
    const tags = await this.repository.getAll(auth.user.id);
    return tags.map((tag) => mapTag(tag));
  }

  async get(auth: AuthDto, id: string): Promise<TagResponseDto> {
    await requireAccess(this.access, { auth, permission: Permission.TAG_READ, ids: [id] });
    const tag = await this.findOrFail(id);
    return mapTag(tag);
  }

  async create(auth: AuthDto, dto: TagCreateDto) {
    if (dto.parentId) {
      await requireAccess(this.access, { auth, permission: Permission.TAG_READ, ids: [dto.parentId] });
    }

    const duplicate = await this.repository.getByNameAndParent(auth.user.id, {
      name: dto.name,
      parentId: dto.parentId ?? undefined,
    });
    if (duplicate) {
      throw new BadRequestException(`A tag with that name already exists`);
    }

    const tag = await this.repository.create({
      userId: auth.user.id,
      name: dto.name,
      parent: dto.parentId ? ({ id: dto.parentId } as TagEntity) : undefined,
    });

    return mapTag(tag);
  }

  async upsert(auth: AuthDto, dto: TagUpsertDto) {
    const tags = await upsertTags(this.repository, { userId: auth.user.id, tags: dto.tags });
    return tags.map((tag) => mapTag(tag));
  }

  async remove(auth: AuthDto, id: string): Promise<void> {
    await requireAccess(this.access, { auth, permission: Permission.TAG_DELETE, ids: [id] });
    await this.repository.delete(id);
  }

  async addAssets(auth: AuthDto, id: string, dto: BulkIdsDto): Promise<BulkIdResponseDto[]> {
    await requireAccess(this.access, { auth, permission: Permission.TAG_ASSET, ids: [id] });

    const results = await addAssets(
      auth,
      { access: this.access, bulk: this.repository },
      { parentId: id, assetIds: dto.ids },
    );

    return results;
  }

  async removeAssets(auth: AuthDto, id: string, dto: BulkIdsDto): Promise<BulkIdResponseDto[]> {
    await requireAccess(this.access, { auth, permission: Permission.TAG_ASSET, ids: [id] });

    const results = await removeAssets(
      auth,
      { access: this.access, bulk: this.repository },
      { parentId: id, assetIds: dto.ids, canAlwaysRemove: Permission.TAG_DELETE },
    );

    return results;
  }

  private async findOrFail(id: string) {
    const tag = await this.repository.get(id);
    if (!tag) {
      throw new BadRequestException('Tag not found');
    }
    return tag;
  }
}
