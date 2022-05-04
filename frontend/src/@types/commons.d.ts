import { AppwriteException, Models } from 'appwrite';

export type AlertVariant = 'info' | 'error' | 'success';
export type UserTheme = 'light' | 'dark';
export type AppUserAuthForm = 'login' | 'signup';
export type AppServerResponseOrError<T> = Promise<
  [T, null] | [null, AppwriteException]
>;

export interface AppGalleryItemType {
  $id: string;
  src: string;
  alt: string;
  title: string;
  text?: string;
  count?: number;
}

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
  theme: UserTheme;
}

export interface AppPublicUser extends Models.Document {
  name: string;
  bio: string;
  location: string;
  avatar_id?: string;
  avatar_href?: string;
}

export interface Ingredient extends Models.Document {
  name: string;
  description: string;
  quantity: number;
  quantity_unit: string;
  calories: number;
  nutrients: string;
}

export interface RecipeCategory extends Models.Document {
  name: string;
  subcategory_ids: string[];
  subcategories?: RecipeCategory[];
}

export interface Recipe extends Models.Document {
  original_recipe_id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  username: string;
  portions_count: number;
  user_id: string;
  tags?: string[];
  primary_image_id?: string;
  gallery_image_ids?: string[];
  primary_image_href?: string;
  gallery_image_hrefs?: string[];
  is_public: boolean;
  category_id?: string;
  category_name?: string;
}

export interface SerializedRecipe extends Models.Document {
  original_recipe_id: string;
  name: string;
  description?: string;
  ingredients: string[];
  username: string;
  portions_count: number;
  user_id: string;
  tags?: string[];
  primary_image_id?: string;
  gallery_image_ids?: string[];
  is_public: boolean;
}

export interface AppUploadPayload {
  fileData: File;
  fileBuffer: ArrayBuffer;
  fileUrl: string;
}
