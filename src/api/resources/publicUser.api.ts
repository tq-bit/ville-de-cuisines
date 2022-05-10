import { Models, Query } from 'appwrite';
import Api from '../appwrite';
import { USER_COLLECTION_ID, AVATAR_BUCKET_ID } from '../../constants';
import { AppPublicUser } from '../../@types';

export default class PublicUserApi extends Api {
  constructor() {
    super(USER_COLLECTION_ID, AVATAR_BUCKET_ID);
  }
  public async fetchPublicUsers() {
    return this.stateful<AppPublicUser[]>(async () => {
      const response = await this.listDocuments();
      const users = response.documents as AppPublicUser[];
      return await this.enrichPublicUserList(users);
    });
  }

  public async fetchPublicUserById(userId: string) {
    return this.stateful<AppPublicUser>(async () => {
      const user = (await this.getDocument(userId)) as AppPublicUser;
      return await this.enrichPublicUser(user);
    });
  }

  public async searchPublicUsers(query: string) {
    return this.stateful<AppPublicUser[]>(async () => {
      const response = await this.listDocuments([Query.search('name', query)]);
      const users = response.documents as AppPublicUser[];
      return await this.enrichPublicUserList(users);
    });
  }

  public async fetchPublicUserAvatar({
    fileId,
    username,
  }: {
    fileId?: string;
    username?: string;
  }) {
    return this.stateful<string>(async () => {
      if (fileId) {
        const response = await this.getFilePreview(fileId);
        return response.href;
      }
      if (username) {
        const response = await this.getClient().avatars.getInitials(username);
        return response.href;
      }
      const response = await this.getClient().avatars.getInitials('John Doe');
      return response.href;
    });
  }

  private async enrichPublicUserList(users: AppPublicUser[]) {
    return Promise.all(users.map((user) => this.enrichPublicUser(user)));
  }

  private async enrichPublicUser(user: AppPublicUser) {
    const [response, error] = await this.fetchPublicUserAvatar({
      fileId: user.avatar_id,
      username: user.name,
    });

    user.avatar_href = response as string;
    return user;
  }
}
