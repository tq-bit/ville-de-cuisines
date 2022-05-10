import { AppFollowEntity, AppFollowEntityPayload } from '../@types/follows';
import { FOLLOWES_COLLECTION_ID } from '../constants';
import { Appwrite, AppwriteException, Models, Query } from 'appwrite';
import { v4 as uuid } from 'uuid';

import useActiveUserStore from './activeUserStore';
import usePublicUserStore from './publicUserStore';

import { defineStore } from 'pinia';
import { appwriteClient } from '../api/appwrite';
import { AppServerResponseOrError, AppGalleryItemType } from '../@types';

import FollowsApi from '../api/resources/follows.api';

const followsApi = new FollowsApi();

const useFollowsStore = defineStore('follows', {
  state: () => ({
    _activeUserFollows: [] as AppFollowEntity[],
  }),

  getters: {
    activeUserFollows: (state) => state._activeUserFollows,
    activeUserFollowsUserEntities: (state) =>
      state._activeUserFollows.filter(
        (follow) => follow?.entity_type === 'user',
      ),
    activeUserFollowsUserEntitiesFeedItems: (state) => {
      const userEntities = state._activeUserFollows.filter(
        (follow) => follow?.entity_type === 'user',
      );
      return userEntities.map((userEntity) => {
        return {
          $id: userEntity.data?.$id,
          src: userEntity.data?.src,
          alt: userEntity.data?.title,
          title: userEntity.data?.title,
          text: userEntity.data?.text,
        } as AppGalleryItemType;
      });
    },
  },

  actions: {
    async syncActiveUserFollows() {
      const activeUserStore = useActiveUserStore();
      const userId = activeUserStore.account.$id;
      const [follows, error] = await followsApi.fetchFollowsByUserId(userId);
      this._activeUserFollows = follows as AppFollowEntity[];
    },
  },
});

export default useFollowsStore;
