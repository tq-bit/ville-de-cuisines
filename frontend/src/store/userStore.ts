import { defineStore } from 'pinia';

import appwriteClient from '../api/appwrite';

const useSessionStore = defineStore('user', {
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
		async fetchUserAccount() {
			const account = await appwriteClient.account.get();
			const avatar = await appwriteClient.avatars.getInitials();
			this._account = account;
			this._avatar = avatar.href;
		},

		setUserAccount(account: any) {
			this._account = account;
		},
	},
});

export default useSessionStore;
