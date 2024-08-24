import localforage from "localforage";

localforage.config({
  name: "expenseManager",
});

export enum KEY_NAMES {
  TRANSACTIONS = "TRANSACTIONS",
}

export class LocalForageService {
  public async setItem(key: KEY_NAMES, value: Record<string, any>) {
    await localforage.setItem(key, value);
  }

  public async getItem(key: KEY_NAMES) {
    const value = await localforage.getItem(key);
    return value;
  }
}
