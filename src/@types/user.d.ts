import { Models } from 'appwrite';

export type UserTheme = 'light' | 'dark';

export interface AppUserLoginPayload {
  id?: string;
  email: string;
  password: string;
  username?: string;
}

export interface AppPublicUserPayload {
  name?: string;
  bio?: string;
  location?: string;
  avatar_id?: string;
  avatar_href?: string;
  facebook_url?: string;
  instagram_url?: string;
  pinterest_url?: string;
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

export interface AppUserPreferences extends Models.Preferences {
  theme: UserTheme;
}

export interface AppPublicUser extends Models.Document {
  name: string;
  bio: string;
  location: string;
  avatar_id?: string;
  avatar_href?: string;
  facebook_url?: string;
  instagram_url?: string;
  pinterest_url?: string;
}
