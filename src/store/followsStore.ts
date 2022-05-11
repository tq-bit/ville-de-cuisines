import { defineStore } from 'pinia';
import { AppGalleryItemType, AppFollowEntity } from '../@types';
import useActiveUserStore from './activeUserStore';
import followsApi from '../api/resources/follows.api';

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
