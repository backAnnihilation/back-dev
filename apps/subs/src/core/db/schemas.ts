import {
  PostImageMeta,
  PostImageMetaSchema,
} from '../../features/subs/domain/entities/post-image-meta.schema';
import {
  ProfileImageMeta,
  ProfileImageMetaSchema,
} from '../../features/subs/domain/entities/user-profile-image-meta.schema';

export const schemas = [
  {
    name: PostImageMeta.name,
    schema: PostImageMetaSchema,
  },
  {
    name: ProfileImageMeta.name,
    schema: ProfileImageMetaSchema,
  },
];
