import { TagEntity } from 'src/entities/tag.entity';
import { ITagRepository } from 'src/interfaces/tag.interface';

type UpsertRequest = { userId: string; tags: string[] };
export const upsertTags = async (repository: ITagRepository, request: UpsertRequest) => {
  const results: TagEntity[] = [];

  for (const path of request.tags) {
    const names = path.split('/');
    let current: TagEntity | null = null;
    for (const name of names) {
      let tag = await repository.getByNameAndParent(request.userId, {
        name,
        parentId: current?.id,
      });

      if (!tag) {
        tag = await repository.create({
          userId: request.userId,
          name,
          parent: current ? ({ id: current.id } as TagEntity) : undefined,
        });
      }

      current = tag;
    }

    if (current) {
      results.push(current);
    }
  }

  return results;
};
