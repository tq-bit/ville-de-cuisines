export default class AppCache {
  cacheKey: string;
  lifetimeInMiliseconds: number;
  cacheMap: { [key: string]: { data: unknown; timeoutKey: number } };

  constructor(cacheKey: string, lifetimeInMiliseconds: number) {
    this.cacheKey = cacheKey;
    this.lifetimeInMiliseconds = lifetimeInMiliseconds;
    this.cacheMap = {};
  }

  public setValue(key: string, value: any) {
    const timeoutKey = this.scheduleEntryDeletion(key);
    this.cacheMap[key] = { data: value, timeoutKey };
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

  private scheduleEntryDeletion(key: string) {
    return setTimeout(() => {
      this.deleteValue(key);
    }, this.lifetimeInMiliseconds);
  }
}
