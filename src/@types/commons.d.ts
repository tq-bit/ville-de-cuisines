export type AlertVariant = 'info' | 'error' | 'success';
export type AppUserAuthForm = 'login' | 'signup';
export type AppGalleryItemEntity =
  | 'user'
  | 'recipe'
  | 'ingredient'
  | 'category';

export interface AppGalleryItemType {
  $id: string;
  src: string;
  alt: string;
  title: string;
  text?: string;
  count?: number;
  type: AppGalleryItemEntity;
}

export interface AppGalleryRecipeItem extends AppGalleryItemType {
  tags?: string[];
  total_calories?: number;
  total_cooking_time?: number;
  calories_per_portion?: number;
}

export interface AppUploadPayload {
  fileData: File;
  fileBuffer: ArrayBuffer;
  fileUrl: string;
}

export interface BooleanMap {
  [key: string]: boolean;
}
