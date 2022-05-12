import { Models } from 'appwrite';
import { CacheMap, CacheMapEntry } from '@/@types';
import useLogger from '@/use/util/logger';

const { log } = useLogger();

export default class AppCache {
  cacheKey: string;
  lifetimeInMiliseconds: number;
  cacheMap: CacheMap;

  constructor(cacheKey: string, lifetimeInMiliseconds: number) {
    this.cacheKey = cacheKey;
    this.lifetimeInMiliseconds = lifetimeInMiliseconds;
    this.cacheMap = {};
  }

  public setValue(key: string, value: CacheMapEntry) {
    const timeoutKey = this.scheduleEntryDeletion(key);
    log(`Cache SET: ${key}`, 'warn');
    return (this.cacheMap[key] = { data: value, timeoutKey });
  }

  public getValue(key: string): CacheMapEntry | null {
    if (this.cacheMap[key]) {
      return this.cacheMap[key]?.data;
    }
    return null;
  }

  public deleteValue(key: string) {
    const { [key]: value, ...rest } = this.cacheMap;
    this.cacheMap = rest;
    return value;
  }

  public updateRelatedCacheEntries(key: string, value: Models.Document | null) {
    for (const cacheMapKey in this.cacheMap) {
      const entryData = this.cacheMap[cacheMapKey].data;
      const cachedEntryIsArray = entryData?.hasOwnProperty('documents');

      if (cachedEntryIsArray) {
        const entries = entryData as Models.DocumentList<Models.Document>;
        const indexOfRelevantElement = entries.documents?.findIndex((entry) => {
          return entry.$id === key;
        });

        // Add, delete or update the entry in the cache
        if (!value) {
          log(`Cache DELETE: ${key}`, 'warn');
          entries.documents.splice(indexOfRelevantElement, 1);
        } else if (indexOfRelevantElement !== -1) {
          log(
            `Cache UPDATE: ${key} at position ${indexOfRelevantElement}`,
            'warn',
          );
          entries.documents[indexOfRelevantElement] = value;
        } else {
          log(`Cache ADD: ${key}`, 'warn');
          entries.documents.push(value);
        }

        this.cacheMap[cacheMapKey] = {
          ...this.cacheMap[cacheMapKey],
          data: entries,
        };
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
