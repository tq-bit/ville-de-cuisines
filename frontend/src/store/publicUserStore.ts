import {
  AppServerResponseOrError,
  AppPublicUser,
  AppGalleryItemType,
} from '../@types/commons';
import { USER_COLLECTION_ID, AVATAR_BUCKET_ID } from '../constants';
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
    publicUserProfileFirstName: (state) =>
      state._publicUserProfile?.name?.split(' ')[0],
    publicUsers: (state) => state._publicUsers,
    publicUserFeedItems: (state) => {
      return state._publicUsers.map((user) => {
        return {
          $id: user.$id,
          title: user.name,
          text: user.bio,
          src: user.avatar_href,
        } as AppGalleryItemType;
      });
    },
  },

  actions: {
    async syncPublicUsers(): Promise<void> {
      // TODO: refactor patching of href locations over public users and user by id
      const response = await appwriteClient.database.listDocuments(
        USER_COLLECTION_ID,
      );
      const documents = response.documents as AppPublicUser[];
      const patchedUsers = await Promise.all(
        documents.map(async (user) => {
          const avatar_href = await this.fetchPublicUserAvatar(
            user.avatar_id as string,
          );
          return {
            ...user,
            avatar_href,
          };
        }),
      );
      this._publicUsers = patchedUsers;
    },

    async syncPublicUserById(userId: string): Promise<void> {
      const [userResponse, userError] = await this.fetchPublicUserById(userId);
      const user = userResponse as AppPublicUser;

      const avatar_href = await this.fetchPublicUserAvatar(
        user.avatar_id as string,
      );
      const patchedUser = {
        ...user,
        avatar_href,
      };
      this._publicUserProfile = patchedUser as AppPublicUser;
    },

    async fetchPublicUserById(
      userId: string,
    ): AppServerResponseOrError<AppPublicUser> {
      try {
        const response = await appwriteClient.database.getDocument(
          USER_COLLECTION_ID,
          userId,
        );
        const user: AppPublicUser = response as AppPublicUser;
        return [user, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async fetchPublicUserAvatar(fileId: string) {
      const fetchUploadedAvatarImage = async (
        fileId: string,
      ): Promise<string> => {
        const response = await appwriteClient.storage.getFilePreview(
          AVATAR_BUCKET_ID,
          fileId,
        );

        return response.href;
      };

      const fetchDefaultAvatarImage = async (): Promise<string> => {
        const response = appwriteClient.avatars.getInitials(
          this._publicUserProfile.name,
        );
        return response.href;
      };

      if (fileId) {
        return await fetchUploadedAvatarImage(fileId);
      } else {
        return await fetchDefaultAvatarImage();
      }
    },
  },
});

export default usePublicUserStore;
