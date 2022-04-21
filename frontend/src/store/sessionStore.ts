import { AppUserLoginPayload, AppServerResponseOrError } from '../@types/commons';
import { defineStore } from 'pinia';
import Cookie from 'js-cookie';
import { AppwriteException } from 'appwrite';

import appwriteClient from '../api/appwrite';
import { SESSION_ID_KEY } from '../constants/index';

const useSessionStore = defineStore('session', {
	state: () => ({
		_account: {
			$id: '',
			name: '',
			registration: 0,
			status: false,
			passwordUpdate: 0,
			email: '',
			emailVerification: false,
			prefs: {},
		},
		_avatar: '',
		_sessionId: '',
	}),

	getters: {
		isUserLoggedIn: (state): boolean => !!state._sessionId,
		account: (state) => ({
			user: state._account,
			avatar: state._avatar,
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
			const avatar = await appwriteClient.avatars.getInitials();
			this._account = account;
			this._avatar = avatar.href;
		},

		async destroyServerSession() {
			try {
				const response = await appwriteClient.account.deleteSession(this._sessionId);
				this.resetUserSession();

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

export default useSessionStore;
