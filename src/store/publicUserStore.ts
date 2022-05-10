import { AppPublicUser, AppGalleryItemType } from '../@types/index';
import PublicUserApi from '../api/resources/publicUser.api';

import { defineStore } from 'pinia';

const publicUserApi = new PublicUserApi();

const usePublicUserStore = defineStore('public_user', {
  state: () => ({
    _publicUserProfile: {} as AppPublicUser,
    _publicUserSearchResults: [] as AppPublicUser[],
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
    publicUserSearchResultsFeedItems: (state) => {
      return state._publicUserSearchResults.map((user) => {
        return {
          $id: user.$id,
          title: user.name,
          text: user.bio,
          src: user.avatar_href,
          type: 'user',
        } as AppGalleryItemType;
      });
    },
  },

  actions: {
    async syncPublicUsers(): Promise<void> {
      const [response, error] = await publicUserApi.fetchPublicUsers();
      if (response) {
        this._publicUsers = response;
      }
    },

    async syncPublicUserById(userId: string): Promise<void> {
      const [response, error] = await publicUserApi.fetchPublicUserById(userId);
      if (response) {
        this._publicUserProfile = response;
      }
    },

    async searchPublicUsers(query: string) {
      const [response, error] = await publicUserApi.searchPublicUsers(query);
      if (response) {
        this._publicUserSearchResults = response;
      }
    },

    resetPublicUserSearch() {
      this._publicUserSearchResults = [];
    },
  },
});

export default usePublicUserStore;
