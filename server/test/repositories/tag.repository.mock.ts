import { ITagRepository } from 'src/interfaces/tag.interface';
import { Mocked, vitest } from 'vitest';

export const newTagRepositoryMock = (): Mocked<ITagRepository> => {
  return {
    getAll: vitest.fn(),
    getByNameAndParent: vitest.fn(),
    upsertAssetTags: vitest.fn(),

    get: vitest.fn(),
    create: vitest.fn(),
    delete: vitest.fn(),

    getAssetIds: vitest.fn(),
    addAssetIds: vitest.fn(),
    removeAssetIds: vitest.fn(),
  };
};
