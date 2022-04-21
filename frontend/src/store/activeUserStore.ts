import {
	AppUserUpdateUsernamePayload,
	AppUserEmailUpdatePayload,
	AppUserUpdatePasswordPayload,
	AppServerResponseOrError,
} from '../@types/commons';
import { AppwriteException } from 'appwrite';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';

const activeUserStore = defineStore('user', {
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
	}),

	getters: {
		account: (state) => ({
			user: state._account,
			avatar: state._avatar,
		}),
	},

	actions: {
		async fetchActiveUserAccount() {
			const accountPromise = appwriteClient.account.get();
			const avatarPromise = appwriteClient.avatars.getInitials();

			const [account, avatar] = await Promise.all([accountPromise, avatarPromise]);

			this._account = account;
			this._avatar = avatar.href;
		},

		async updateUsername({ username }: AppUserUpdateUsernamePayload): AppServerResponseOrError {
			try {
				console.log(username);
				const response = await appwriteClient.account.updateName(username as string);
				return [response, null];
			} catch (error) {
				console.error(error);
				return [null, error as AppwriteException];
			}
		},

		async updateEmail({ email, password }: AppUserEmailUpdatePayload): AppServerResponseOrError {
			try {
				const response = await appwriteClient.account.updateEmail(
					email as string,
					password as string
				);
				return [response, null];
			} catch (error) {
				return [null, error as AppwriteException];
			}
		},

		async updatePassword({
			oldPassword,
			newPassword,
		}: AppUserUpdatePasswordPayload): AppServerResponseOrError {
			try {
				const response = await appwriteClient.account.updatePassword(
					newPassword as string,
					oldPassword as string
				);
				return [response, null];
			} catch (error) {
				return [null, error as AppwriteException];
			}
		},

		setUserAccount(account: any) {
			this._account = account;
		},
	},
});

export default activeUserStore;
