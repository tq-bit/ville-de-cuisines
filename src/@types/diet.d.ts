import { Models } from 'appwrite';
import { Recipe } from './recipe';

export type DietTime = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface DietEntry extends Models.Document {
  user_id: string;
  recipe_id: string;
  date_unix: number;
  diet_time: DietTime;
  recipe?: Recipe;
}
