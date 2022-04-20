import { AppwriteException } from 'appwrite';

export type AlertVariant = 'info' | 'error' | 'success'

export interface AppUserLoginPayload {
	email: string;
	password: string;
	username?: string;
}

export interface AppServerErrorResponse {
	message: string;
	code: number
}

export type AppUserForm = 'login' | 'signup';

export type AppServerResponseOrError = Promise<[unknown, null] | [null, AppwriteException]>;