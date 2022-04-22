import { AppwriteException } from 'appwrite';

export type AlertVariant = 'info' | 'error' | 'success';
export type UserTheme = 'light' | 'dark';

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

export interface AppUserPreferences {
  bio: string;
  theme: UserTheme;
  location: string;
}

export type AppUserAuthForm = 'login' | 'signup';

export type AppServerResponseOrError = Promise<
  [unknown, null] | [null, AppwriteException]
>;
