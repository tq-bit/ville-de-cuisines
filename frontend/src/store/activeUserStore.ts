import {
  AppUserUpdateUsernamePayload,
  AppUserEmailUpdatePayload,
  AppUserUpdatePasswordPayload,
  AppServerResponseOrError,
  AppUserPreferences,
} from '../@types/commons';
import { AppwriteException, Models } from 'appwrite';

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
    },
    _location: {} as Models.Locale,
    _prefs: {} as AppUserPreferences,
    _avatar: '',
  }),

  getters: {
    user: (state) => state._account,
    location: (state) => state._location,
    prefs: (state) => state._prefs,
    avatar: (state) => state._avatar,
  },

  actions: {
    async fetchActiveUserAccount() {
      const accountPromise = appwriteClient.account.get();
      const avatarPromise = appwriteClient.avatars.getInitials();
      const locationPromise = appwriteClient.locale.get();

      const [account, avatar, location] = await Promise.all([
        accountPromise,
        avatarPromise,
        locationPromise,
      ]);

      const { prefs, ...accountInfo } = account;

      this._account = accountInfo;
      this._location = location;
      this._prefs = prefs as AppUserPreferences;
      this._avatar = avatar.href;
    },

    async updateUsername({
      username,
    }: AppUserUpdateUsernamePayload): AppServerResponseOrError {
      try {
        this._account.name = username as string;
        const response = await appwriteClient.account.updateName(
          username as string,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async updateEmail({
      email,
      password,
    }: AppUserEmailUpdatePayload): AppServerResponseOrError {
      try {
        this._account.email = email as string;
        const response = await appwriteClient.account.updateEmail(
          email as string,
          password as string,
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
          oldPassword as string,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async updatePreferences(
      payload: AppUserPreferences,
    ): AppServerResponseOrError {
      try {
        const response = await appwriteClient.account.updatePrefs(payload);
        this._prefs = response.prefs as AppUserPreferences;
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },
  },
});

export default activeUserStore;
