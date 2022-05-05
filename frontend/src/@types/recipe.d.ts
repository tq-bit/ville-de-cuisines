import { Models } from 'appwrite';

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
  primary_image_id?: string;
  primary_image_href?: string;
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
  total_calories: number;
}

export interface RecipeMap {
  [key: string]: Recipe[];
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
  primary_image_href?: string;
  gallery_image_hrefs?: string[];
  is_public: boolean;
  category_id?: string;
  category_name?: string;
  total_calories: number;
}
