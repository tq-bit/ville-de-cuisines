import { AppServerResponseOrError, AppPublicUser } from '../@types/commons';
import { USER_COLLECTION_ID, AVATAR_BUCKET_ID } from '../constants';
import { Appwrite, AppwriteException, Models, Query } from 'appwrite';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';

const usePublicUserStore = defineStore('public_user', {
  state: () => ({
    _publicUserProfile: {} as AppPublicUser,
    _publicUserProfileAvatar: '' as string,
    _publicUsers: [] as AppPublicUser[],
  }),

  getters: {
    publicUserProfile: (state) => state._publicUserProfile,
    publicUserProfileAvatar: (state) => state._publicUserProfileAvatar,
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

    async fetchPublicUserAvatar() {
      const avatarFileId = this._publicUserProfile.avatar_id || '';

      const fetchUploadedAvatarImage = async (
        fileId: string,
      ): Promise<void> => {
        const response = await appwriteClient.storage.getFilePreview(
          AVATAR_BUCKET_ID,
          avatarFileId,
        );

        this._publicUserProfileAvatar = response.href;
      };

      const fetchDefaultAvatarImage = async (): Promise<void> => {
        const response = appwriteClient.avatars.getInitials(
          this._publicUserProfile.name,
        );
        this._publicUserProfileAvatar = response.href;
      };

      if (avatarFileId) {
        await fetchUploadedAvatarImage(avatarFileId);
      } else {
        await fetchDefaultAvatarImage();
      }
    },
  },
});

export default usePublicUserStore;
