import {
  OutboxEntity,
  OutboxSchema,
} from '../../features/file/domain/entities/outbox.schema';
import {
  PostImageMeta,
  PostImageMetaSchema,
} from '../../features/file/domain/entities/post-image-meta.schema';
import {
  ProfileImageMeta,
  ProfileImageMetaSchema,
} from '../../features/file/domain/entities/user-profile-image-meta.schema';

export const schemas = [
  {
    name: PostImageMeta.name,
    schema: PostImageMetaSchema,
  },
  {
    name: ProfileImageMeta.name,
    schema: ProfileImageMetaSchema,
  },
  {
    name: OutboxEntity.name,
    schema: OutboxSchema,
  },
];
