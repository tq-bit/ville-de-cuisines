import { AppwriteException, Models } from 'appwrite';

export type AppServerResponseOrError<T> = Promise<
  [T, null] | [null, AppwriteException]
>;

export interface AppServerErrorResponse {
  message: string;
  code: number;
}

export type CacheMapEntry =
  | Models.Document
  | Models.DocumentList<Models.Document>;
export interface CacheMap {
  [key: string]: {
    data: CacheMapEntry;
    timeoutKey: number;
  };
}
