import { Appwrite, Models } from 'appwrite';
import { v4 as uuid } from 'uuid';

const appwriteClient = new Appwrite();
appwriteClient
  .setEndpoint('http://localhost/v1')
  .setProject('625ea6425efdf4cc9a46');
export { appwriteClient };

export default class Api {
  private client: Appwrite;
  private collectionId: string;
  private bucketId: string;

  constructor(collectionId: string, bucketId: string) {
    this.client = appwriteClient;
    this.collectionId = collectionId;
    this.bucketId = bucketId;
  }

  protected async createDocument(
    payload: any,
    read?: string[] | undefined,
    write?: string[] | undefined,
  ): Promise<Models.Document> {
    const response = await this.client.database.createDocument(
      this.collectionId,
      uuid(),
      payload,
      read,
      write,
    );
    return response;
  }

  protected async listDocuments(
    queries?: string[] | undefined,
    limit?: number | undefined,
    offset?: number | undefined,
    cursor?: string | undefined,
    cursorDirection?: string | undefined,
    orderAttributes?: string[] | undefined,
    orderTypes?: string[] | undefined,
  ) {
    const response = await this.client.database.listDocuments(
      this.collectionId,
      queries,
      limit,
      offset,
      cursor,
      cursorDirection,
      orderAttributes,
      orderTypes,
    );
    return response;
  }

  protected async updateDocument(
    payload: any,
    read?: string[] | undefined,
    write?: string[] | undefined,
  ) {
    const response = await this.client.database.updateDocument(
      this.collectionId,
      payload.$id,
      payload,
      read,
      write,
    );
    return response;
  }

  protected async deleteDocument(documentId: string) {
    const response = await this.client.database.deleteDocument(
      this.collectionId,
      documentId,
    );
    return response;
  }

  protected async uploadFile(
    file: File,
    read?: string[] | undefined,
    write?: string[] | undefined,
  ): Promise<Models.File> {
    const response = await this.client.storage.createFile(
      this.bucketId,
      uuid(),
      file,
      read,
      write,
    );
    return response;
  }

  protected async deleteFile(fileId: string) {
    const response = await this.client.storage.deleteFile(
      this.bucketId,
      fileId,
    );
    return response;
  }
}
