import { Models } from 'appwrite';

export type AppFollowEntityType = 'user' | 'recipe' | 'ingredient' | 'category';

export interface AppFollowEntityData {
  $id: string;
  src: string;
  alt: string;
  title: string;
  text?: string;
  count?: number;
}

export interface AppFollowEntity extends Models.Document {
  entity_id: string;
  followed_by?: string;
  entity_type: AppFollowEntityType;
  data?: AppFollowEntityData;
}
