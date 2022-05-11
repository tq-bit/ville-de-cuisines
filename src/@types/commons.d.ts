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
export interface AppUploadPayload {
  fileData: File;
  fileBuffer: ArrayBuffer;
  fileUrl: string;
}

export interface BooleanMap {
  [key: string]: boolean;
}
