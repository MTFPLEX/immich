import { IsNotEmpty, IsString } from 'class-validator';
import { TagEntity } from 'src/entities/tag.entity';
import { ValidateUUID } from 'src/validation';

export class TagCreateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ValidateUUID({ optional: true, nullable: true })
  parentId?: string | null;
}

export class TagUpsertDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags!: string[];
}

export class TagResponseDto {
  id!: string;
  name!: string;
  path!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export function mapTag(entity: TagEntity): TagResponseDto {
  const tags = [entity.name];
  let parent = entity.parent;
  while (parent) {
    tags.push(parent.name);
    parent = parent.parent;
  }

  return {
    id: entity.id,
    name: entity.name,
    path: tags.toReversed().join('/'),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
