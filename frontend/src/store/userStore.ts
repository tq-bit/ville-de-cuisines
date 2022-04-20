import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';
import Cookie from 'js-cookie';

import { AppUserLoginPayload, AppServerResponseOrError } from '../@types/commons';
import { AppwriteException } from 'appwrite';

const SESSION_ID_KEY = 'appgram-session-id';

const useUserStore = defineStore('user', {
	state: () => ({
		_account: {},
		_sessionId: '',
	}),

	getters: {
		isUserLoggedIn: (state): boolean => !!state._sessionId,
		account: (state) => ({
			account: state._account,
		}),
		sessionId: (state) => ({
			sessionId: state._sessionId,
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
				this.setSessionId(sessionId);
				this.fetchUserAccount();

				return [sessionId, null];
			} catch (error) {
				return [null, error as AppwriteException];
			}
		},

		async fetchUserAccount() {
			const account = await appwriteClient.account.get();
			console.log(account)
			this._account = account;
		},

		async logout() {
			try {
				const response = await appwriteClient.account.deleteSession(this._sessionId);
				this._sessionId = '';

				return [response, null];
			} catch (error) {
				return [null, error as AppwriteException];
			}
		},

		syncLocalSessionIdWithCookie() {
			const cookieTokenState = Cookie.get(SESSION_ID_KEY) || null;
			if (this._sessionId !== '') {
				Cookie.set(SESSION_ID_KEY, this._sessionId);
			}

			if (!!cookieTokenState) {
				this._sessionId = cookieTokenState;
			}
		},

		setSessionId(sessionId: string) {
			Cookie.set(SESSION_ID_KEY, sessionId);
			this._sessionId = sessionId;
		},

		setUserAccount(account: any) {
			this._account = account;
		},

		resetUserSession() {
			this.setSessionId('');
			this.setUserAccount({});
		},
	},
});

export default useUserStore;
