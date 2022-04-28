import {
  AppUserUpdateUsernamePayload,
  AppUserEmailUpdatePayload,
  AppUserUpdatePasswordPayload,
  AppServerResponseOrError,
  AppUserPreferences,
} from '../@types/commons';
import { AVATAR_BUCKET_ID } from '../constants/index';
import { AppwriteException, Models } from 'appwrite';
import { v4 as uuid } from 'uuid';

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
    _avatar_url: '' as string,
  }),

  getters: {
    user: (state) => state._account,
    location: (state) => state._location,
    prefs: (state) => state._prefs,
    avatar: (state) => state._avatar_url,
  },

  actions: {
    async fetchActiveUserAccount(): Promise<void> {
      const accountPromise = appwriteClient.account.get();
      const locationPromise = appwriteClient.locale.get();

      const [account, location] = await Promise.all([
        accountPromise,
        locationPromise,
      ]);

      const { prefs, ...accountInfo } = account;

      this._account = accountInfo;
      this._location = location;
      this._prefs = prefs as AppUserPreferences;
    },

    async fetchActiveUserAvatar(): Promise<void> {
      const avatarFileId = this._prefs.avatar_id;

      const fetchUploadedAvatarImage = async (
        fileId: string,
      ): Promise<void> => {
        const response = await appwriteClient.storage.getFilePreview(
          AVATAR_BUCKET_ID,
          fileId,
        );

        this._avatar_url = response.href;
      };

      const fetchDefaultAvatarImage = async (): Promise<void> => {
        const response = appwriteClient.avatars.getInitials();
        this._avatar_url = response.href;
      };

      if (avatarFileId) {
        await fetchUploadedAvatarImage(avatarFileId);
      } else {
        await fetchDefaultAvatarImage();
      }
    },

    async updateUsername({
      username,
    }: AppUserUpdateUsernamePayload): AppServerResponseOrError<
      Models.User<Models.Preferences>
    > {
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
    }: AppUserEmailUpdatePayload): AppServerResponseOrError<
      Models.User<Models.Preferences>
    > {
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
    }: AppUserUpdatePasswordPayload): AppServerResponseOrError<
      Models.User<Models.Preferences>
    > {
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
    ): AppServerResponseOrError<Models.User<Models.Preferences>> {
      try {
        const response = await appwriteClient.account.updatePrefs(payload);
        this._prefs = response.prefs as AppUserPreferences;
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async handleAvatarUpload(
      file: File,
    ): AppServerResponseOrError<Models.File> {
      try {
        const userHasAvatarImage: boolean = !!this._prefs.avatar_id;
        let response: Models.File;

        const createAvatarUpload = async () => {
          const fileId = uuid();
          return appwriteClient.storage.createFile(
            AVATAR_BUCKET_ID,
            fileId,
            file,
          );
        };

        const updateAvatarUpload = async () => {
          const fileId = this._prefs.avatar_id;
          await appwriteClient.storage.deleteFile(
            AVATAR_BUCKET_ID,
            fileId as string,
          );
          return appwriteClient.storage.createFile(
            AVATAR_BUCKET_ID,
            fileId as string,
            file,
          );
        };

        if (!userHasAvatarImage) {
          response = await createAvatarUpload();
        } else {
          response = await updateAvatarUpload();
        }

        await this.updatePreferences({
          ...this._prefs,
          avatar_id: response.$id,
        });

        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },
  },
});

export default activeUserStore;
