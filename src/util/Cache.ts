export class AppCache<T> {
  cacheKey: string;
  lifetimeInMiliseconds: number;
  cacheMap: { [key: string]: { data: T; timeoutKey: number } };

  constructor(cacheKey: string, lifetimeInMiliseconds: number) {
    this.cacheKey = cacheKey;
    this.lifetimeInMiliseconds = lifetimeInMiliseconds;
    this.cacheMap = {};
  }

  public setValue(key: string, value: T) {
    const timeoutKey = this.scheduleEntryDeletion(key);
    this.cacheMap[key] = { data: value, timeoutKey };
  }

  public getValue(key: string): T {
    return this.cacheMap[key]?.data;
  }

  private deleteValue(key: string) {
    const { [key]: value, ...rest } = this.cacheMap;
    this.cacheMap = rest;
    return value;
  }

  private scheduleEntryDeletion(key: string) {
    return setTimeout(() => {
      this.deleteValue(key);
    }, this.lifetimeInMiliseconds);
  }
}
