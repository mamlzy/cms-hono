import type { PostStatus } from '@repo/db/schema';
import type { Option } from '@repo/shared/types';

export const postStatusOptions: Option<PostStatus>[] = [
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
];
