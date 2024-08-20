import { getAllTags, type TagResponseDto } from '@immich/sdk';
import { derived, get, writable } from 'svelte/store';

const tagStore = writable<TagResponseDto[]>([]);
const tagCache = derived([tagStore], () => Object.fromEntries(get(tagStore).map((tag) => [tag.id, tag])));
const getTagPath = (tagId: string) => get(tagCache)[tagId]?.path;

export const tagPath = derived([tagCache], () => getTagPath);
export const loadTags = async () => {
  const tags = await getAllTags();
  tagStore.set(tags);
};
