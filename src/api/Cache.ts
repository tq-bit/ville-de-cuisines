import { Models } from 'appwrite';

export type CacheMapEntry =
  | Models.Document
  | Models.DocumentList<Models.Document>;
export interface CacheMap {
  [key: string]: {
    data: CacheMapEntry;
    timeoutKey: number;
  };
}

export default class AppCache {
  cacheKey: string;
  lifetimeInMiliseconds: number;
  cacheMap: CacheMap;

  constructor(cacheKey: string, lifetimeInMiliseconds: number) {
    this.cacheKey = cacheKey;
    this.lifetimeInMiliseconds = lifetimeInMiliseconds;
    this.cacheMap = {};
  }

  public setValue(key: string, value: any) {
    const timeoutKey = this.scheduleEntryDeletion(key);
    this.updateEntryInListItems(key, value, timeoutKey);
  }

  public getValue(key: string): any {
    if (this.cacheMap[key]) {
      return this.cacheMap[key]?.data;
    }
    return null;
  }

  private deleteValue(key: string) {
    const { [key]: value, ...rest } = this.cacheMap;
    this.cacheMap = rest;
    return value;
  }

  private updateEntryInListItems(key: string, value: any, timeoutKey: number) {
    if (!this.cacheMap[key]) {
      return (this.cacheMap[key] = { data: value, timeoutKey });
    } else {
      for (const cacheMapKey in this.cacheMap) {
        const cachedEntryIsArray = Array.isArray(
          // @ts-ignore
          this.cacheMap[cacheMapKey].data?.documents,
        );

        if (!cachedEntryIsArray) {
          this.cacheMap[cacheMapKey].data = value;
        } else {
          const filteredEntries = this.cacheMap[
            cacheMapKey
            // @ts-ignore
          ].data?.documents?.filter((entry: Models.Document) => {
            return entry.$id !== key;
          });
          const newEntry = { data: value, timeoutKey };
          this.cacheMap[cacheMapKey] = { ...filteredEntries, newEntry };
        }
      }
    }
  }

  private scheduleEntryDeletion(key: string) {
    return setTimeout(() => {
      this.deleteValue(key);
    }, this.lifetimeInMiliseconds);
  }

  public getCacheKey() {
    return this.cacheKey;
  }
}
