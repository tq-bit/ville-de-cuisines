import { AppwriteException, Models } from 'appwrite';

export type AlertVariant = 'info' | 'error' | 'success';
export type UserTheme = 'light' | 'dark';
export type AppUserAuthForm = 'login' | 'signup';
export type AppServerResponseOrError = Promise<
  [unknown, null] | [null, AppwriteException]
>;

export interface AppUserLoginPayload {
  email: string;
  password: string;
  username?: string;
}

export interface AppUserUpdateUsernamePayload {
  username?: string;
}

export interface AppUserEmailUpdatePayload {
  email?: string;
  password?: string;
}

export interface AppUserUpdatePasswordPayload {
  oldPassword?: string;
  newPassword?: string;
}

export interface AppServerErrorResponse {
  message: string;
  code: number;
}

export interface AppUserPreferences extends Models.Preferences {
  bio: string;
  theme: UserTheme;
  location: string;
}

export interface Ingredient extends Models.Document {
  name: string;
  description: string;
  quantity: number;
  quantity_unit: string;
  calories: number;
  nutrients: string;
}

export interface AppUploadPayload {
  fileData: File;
  fileBuffer: ArrayBuffer;
  fileUrl: string;
}
