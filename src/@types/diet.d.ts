import { Models } from 'appwrite';
import { Recipe } from './recipe';

export type DietDayTime = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface AppDietEntity extends Models.Document {
  user_id: string;
  recipe_id: string;
  date_unix: number;
  diet_time: DietDayTime;
  recipe?: Recipe;
}

export interface AppDietMap {
  [key: string]: AppDietEntity;
}

export interface DayWithDiet {
  dayName?: string;
  localDateString: string;
  localTimeMidnightUnix?: number;
  timezoneOffsetSeconds?: number;
  isToday?: boolean;
  diets: AppDietEntity[];
}

export interface DietDayQuery {
  time: DietDayTime;
  date: string;
}
