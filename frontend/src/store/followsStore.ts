import { AppFollowEntity, AppFollowEntityData } from '../@types/follows';
import { FOLLOWES_COLLECTION_ID } from '../constants';
import { Appwrite, AppwriteException, Models, Query } from 'appwrite';
import { v4 as uuid } from 'uuid';

import useActiveUserStore from './activeUserStore';
import usePublicUserStore from './publicUserStore';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';
import { AppServerResponseOrError } from '../@types';

const useFollowsStore = defineStore('follows', {
  state: () => ({
    _activeUserFollows: [] as AppFollowEntity[],
  }),

  getters: {
    activeUserFollows: (state) => state._activeUserFollows,
  },

  actions: {
    async syncActiveUserFollows() {
      const activeUserStore = useActiveUserStore();
      const userId = activeUserStore.account.$id;
      const [follows, error] = await this.getFollowsByUserId(userId);
      this._activeUserFollows = follows as AppFollowEntity[];
    },

    async getFollowsByUserId(
      userId: string,
    ): Promise<AppServerResponseOrError<AppFollowEntity[]>> {
      try {
        const response = await appwriteClient.database.listDocuments(
          FOLLOWES_COLLECTION_ID,
          [Query.equal('followed_by', userId)],
        );
        const follows = await this.enrichFollows(
          response.documents as AppFollowEntity[],
        );
        return [follows, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async createFollow(followEntity: AppFollowEntity) {
      try {
        const activeUserStore = useActiveUserStore();
        followEntity.followed_by = activeUserStore.account.$id;
        const response = await appwriteClient.database.createDocument(
          FOLLOWES_COLLECTION_ID,
          uuid(),
          followEntity,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async enrichFollows(
      follows: AppFollowEntity[],
    ): Promise<AppFollowEntity[]> {
      return Promise.all(
        follows.map(async (followEntity) => {
          if (followEntity.entity_type === 'user') {
            return await enrichUserEntity(followEntity);
          } else {
            return followEntity;
          }
        }),
      );

      // TODO: Refactor this together with the public user store
      async function enrichUserEntity(
        user: AppFollowEntity,
      ): Promise<AppFollowEntity> {
        const userStore = usePublicUserStore();
        const [userResponse, userError] = await userStore.fetchPublicUserById(
          user.$id,
        );
        if (userError) console.log(userError);
        const avatar_href = await userStore.fetchPublicUserAvatar(
          userResponse?.avatar_id as string,
        );
        return {
          ...user,
          data: {
            $id: userResponse?.$id || '',
            src: avatar_href,
            alt: userResponse?.name || '',
            title: userResponse?.name || '',
            text: userResponse?.bio || '',
          },
        };
      }
    },
  },
});

export default useFollowsStore;
