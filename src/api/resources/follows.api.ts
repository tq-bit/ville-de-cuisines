import { v4 as uuid } from 'uuid';
import { Query } from 'appwrite';
import { AppFollowEntity, AppFollowEntityPayload } from '@/@types';
import { FOLLOWES_COLLECTION_ID } from '@/constants';
import Api from '@/api/appwrite';
import PublicUserApi from './publicUser.api';

const publicUserApi = new PublicUserApi();

export default class FollowsApi extends Api {
  constructor() {
    super(FOLLOWES_COLLECTION_ID, '');
  }

  public async createFollowEntity(followEntity: AppFollowEntityPayload) {
    return this.stateful(async () => {
      return this.createDocument(uuid(), followEntity);
    });
  }

  public async deleteFollowEntity(followEntityId: string) {
    return this.stateful(async () => {
      const response = await this.listDocuments([
        Query.equal('entity_id', followEntityId),
      ]);
      const follow = response.documents[0] as AppFollowEntity;
      return this.deleteDocument(follow.$id);
    });
  }

  public async fetchFollowsByUserId(userId: string) {
    return this.stateful<AppFollowEntity[]>(async () => {
      const response = await this.listDocuments(
        [Query.equal('followed_by', userId)],
        100,
      );
      const follows = response.documents as AppFollowEntity[];
      return await this.enrichFollowEntityList(follows);
    });
  }

  public async fetchFollowByEntityId(followEntityId: string) {
    return this.stateful<AppFollowEntity>(async () => {
      const response = await this.listDocuments([
        Query.equal('entity_id', followEntityId),
      ]);
      const follow = response.documents[0] as AppFollowEntity;
      return await this.enrichFollowEntity(follow);
    });
  }

  private async enrichFollowEntityList(follows: AppFollowEntity[]) {
    return Promise.all(
      follows.map(async (followEntity) =>
        this.enrichFollowEntity(followEntity),
      ),
    );
  }

  private async enrichFollowEntity(followEntity: AppFollowEntity) {
    if (followEntity.entity_type === 'user') {
      return await this.enrichUserFollowEntity(followEntity);
    } else {
      return followEntity;
    }
  }

  private async enrichUserFollowEntity(user: AppFollowEntity) {
    const [userResponse, userError] = await publicUserApi.fetchPublicUserById(
      user.entity_id,
    );
    const [avatarResponse, avatarError] =
      await publicUserApi.fetchPublicUserAvatar({
        fileId: userResponse?.avatar_id,
        username: userResponse?.name,
      });
    return {
      ...user,
      data: {
        $id: userResponse?.$id || '',
        src: avatarResponse,
        alt: userResponse?.name || '',
        title: userResponse?.name || '',
        text: userResponse?.bio || '',
      },
    };
  }
}
