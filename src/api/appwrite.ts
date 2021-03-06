import { Appwrite, Models, AppwriteException } from 'appwrite';
import { v4 as uuid } from 'uuid';
import { AppServerResponseOrError } from '@/@types';
import { DEV_URL, PROD_URL, APP_CACHE_LIFETIME_MS } from '@/constants';
import Cache from './Cache';

const appwriteClient = new Appwrite();

appwriteClient
  .setEndpoint(import.meta.env.DEV ? DEV_URL : PROD_URL)
  .setProject('625ea6425efdf4cc9a46');
export { appwriteClient };
export default class Api {
  private client: Appwrite;
  private collectionId: string;
  private bucketId: string;
  private cache: Cache;

  constructor(collectionId: string, bucketId: string) {
    this.client = appwriteClient;
    this.collectionId = collectionId;
    this.bucketId = bucketId;
    this.cache = new Cache(collectionId, APP_CACHE_LIFETIME_MS);
  }

  protected async createDocument(
    id: string,
    payload: any,
    read?: string[] | undefined,
    write?: string[] | undefined,
  ): Promise<Models.Document> {
    const response = await this.client.database.createDocument(
      this.collectionId,
      id,
      payload,
      read,
      write,
    );
    this.cache.setValue(response.$id, response);
    this.cache.updateRelatedCacheEntries(response.$id, response);
    return response;
  }

  protected async getDocument(documentId: string) {
    const cachedResponse = this.cache.getValue(documentId);
    if (cachedResponse) {
      return cachedResponse as Models.Document;
    } else {
      const response = await this.client.database.getDocument(
        this.collectionId,
        documentId,
      );
      this.cache.setValue(documentId, response);
      return response;
    }
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
    const cacheId = this.generateCacheIdForDocumentList(queries);
    const cachedResponse = this.cache.getValue(cacheId);
    if (cachedResponse) {
      return cachedResponse as Models.DocumentList<Models.Document>;
    } else {
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
      this.cache.setValue(cacheId, response);
      return response;
    }
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
    this.cache.setValue(response.$id, response);
    this.cache.updateRelatedCacheEntries(response.$id, response);
    return response;
  }

  protected async deleteDocument(documentId: string) {
    const response = await this.client.database.deleteDocument(
      this.collectionId,
      documentId,
    );
    this.cache.deleteValue(documentId);
    this.cache.updateRelatedCacheEntries(documentId, null);
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

  protected getFilePreview(
    fileId: string,
    width?: number | undefined,
    height?: number | undefined,
    gravity?: string | undefined,
    quality?: number | undefined,
    borderWidth?: number | undefined,
    borderColor?: string | undefined,
    borderRadius?: number | undefined,
    opacity?: number | undefined,
    rotation?: number | undefined,
    background?: string | undefined,
    output?: string | undefined,
  ) {
    const response = this.client.storage.getFilePreview(
      this.bucketId,
      fileId,
      width,
      height,
      gravity,
      quality,
      borderWidth,
      borderColor,
      borderRadius,
      opacity,
      rotation,
      background,
      output,
    );
    return response;
  }

  protected async stateful<T>(fn: Function): AppServerResponseOrError<T> {
    try {
      const result: T = await fn();
      return [result, null];
    } catch (error) {
      console.error(error);
      return [null, error as AppwriteException];
    }
  }

  protected getClient() {
    return this.client;
  }

  private generateCacheIdForDocumentList(queries: string[] | undefined) {
    const hasQueries = !!queries && queries.length > 0;
    if (hasQueries) {
      return this.cache.getCacheKey() + '-' + queries?.join('-');
    }
    return this.cache.getCacheKey();
  }
}
