import { AppwriteException } from 'appwrite';

export type AlertVariant = 'info' | 'error' | 'success' | 'warning';

export interface AppUserLoginPayload {
	email: string;
	password: string;
	username?: string;
}

export type AppUserForm = 'login' | 'signup';

export type AppServerResponseOrError = Promise<[unknown, null] | [null, AppwriteException]>;
