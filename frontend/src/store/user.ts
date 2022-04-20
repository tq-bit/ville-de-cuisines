import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';

import { AppUserLoginPayload, AppServerResponseOrError } from '../@types/commons';
import { AppwriteException } from 'appwrite';

const useStore = defineStore('user', {
	state: () => ({
		user: {},
		token: '',
	}),

	getters: {
		isUserLoggedIn: (state): boolean => !!state.token,
	},

	actions: {
		signup: async ({ email, password, username }: AppUserLoginPayload): AppServerResponseOrError => {
			try {
				const response = await appwriteClient.account.create('unique()', email, password, username);
				console.log(response);
				return [response, null];
			} catch (error) {
				console.log(error)
				return [null, error as AppwriteException];
			}
		},
		login: async ({ password, email }: AppUserLoginPayload) => {
      try {
        const response = await appwriteClient.account.createSession(email, password);
        console.log(response);
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },
		logout: async () => {},
	},
});

export default useStore