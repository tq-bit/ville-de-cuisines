export type AlertVariant = 'info' | 'error' | 'success';
export type AppUserAuthForm = 'login' | 'signup';

export interface AppGalleryItemType {
  $id: string;
  src: string;
  alt: string;
  title: string;
  text?: string;
  count?: number;
}
export interface AppUploadPayload {
  fileData: File;
  fileBuffer: ArrayBuffer;
  fileUrl: string;
}
