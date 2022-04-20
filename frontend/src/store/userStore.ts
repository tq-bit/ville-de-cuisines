import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';

import { AppUserLoginPayload, AppServerResponseOrError } from '../@types/commons';
import { AppwriteException } from 'appwrite';

const useStore = defineStore('user', {
	state: () => ({
		account: {},
		preferences: {},
		token: '',
		sessionId: '',
	}),

	getters: {
		isUserLoggedIn: (state): boolean => !!state.token && !!state.sessionId,
		userAccount: (state) => ({
			account: state.account,
			preferences: state.preferences,
		}),
		userSessionData: (state) => ({
			token: state.token,
			sessionId: state.sessionId,
		}),
	},

	actions: {
		async signup({ email, password, username }: AppUserLoginPayload): AppServerResponseOrError {
			try {
				const response = await appwriteClient.account.create('unique()', email, password, username);
				return [response, null];
			} catch (error) {
				return [null, error as AppwriteException];
			}
		},

		async login({ password, email }: AppUserLoginPayload): AppServerResponseOrError {
			try {
				const { $id: sessionId } = await appwriteClient.account.createSession(email, password);
				this.sessionId = sessionId;

				this.flushUserAccountPromises();

				return [sessionId, null];
			} catch (error) {
				return [null, error as AppwriteException];
			}
		},

		async logout() {
			try {
				const response = await appwriteClient.account.deleteSession(this.sessionId);
				this.sessionId = '';

				return [response, null];
			} catch (error) {
				return [null, error as AppwriteException];
			}
		},

		async flushUserAccountPromises() {
			const accountPromise = appwriteClient.account.get();
			const preferencesPromise = appwriteClient.account.getPrefs();
			const tokenPromise = appwriteClient.account.createJWT();

			const [account, preferences, token] = await Promise.all([
				accountPromise,
				preferencesPromise,
				tokenPromise,
			]);
			this.account = account;
			this.preferences = preferences;
			this.token = token.jwt;
		},
	},
});

export default useStore;
