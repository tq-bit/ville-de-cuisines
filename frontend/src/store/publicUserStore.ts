import { AppServerResponseOrError, AppPublicUser } from '../@types/commons';
import { USER_COLLECTION_ID } from '../constants';
import { Appwrite, AppwriteException, Models, Query } from 'appwrite';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';

const usePublicUserStore = defineStore('public_user', {
  state: () => ({
    _publicUserProfile: {} as AppPublicUser,
    _publicUsers: [] as AppPublicUser[],
  }),

  getters: {
    publicUserProfile: (state) => state._publicUserProfile,
    publicUsers: (state) => state._publicUsers,
  },

  actions: {
    async fetchPublicUsers(): Promise<void> {
      const response = await appwriteClient.database.listDocuments(
        USER_COLLECTION_ID,
      );
      this._publicUsers = response.documents as AppPublicUser[];
    },

    async fetchPublicUserById(userId: string): Promise<void> {
      const response = await appwriteClient.database.getDocument(
        USER_COLLECTION_ID,
        userId,
      );
      this._publicUserProfile = response as AppPublicUser;
    },
  },
});

export default usePublicUserStore;
