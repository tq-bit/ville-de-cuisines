import { defineStore } from 'pinia';

import appwriteClient from '../api/appwrite';

const activeactiveUserStore = defineStore('user', {
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

		setUserAccount(account: any) {
			this._account = account;
		},
	},
});

export default activeactiveUserStore;
