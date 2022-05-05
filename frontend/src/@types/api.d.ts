import { AppwriteException } from 'appwrite';

export type AppServerResponseOrError<T> = Promise<
  [T, null] | [null, AppwriteException]
>;

export interface AppServerErrorResponse {
  message: string;
  code: number;
}
