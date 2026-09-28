export interface PrefStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export interface PrefStore {
    read<T>(key: string, fallback: T): T;
    write(key: string, value: unknown): void;
}
export declare function createPrefStore(storage: PrefStorage | undefined): PrefStore;
export declare function browserPrefStorage(): PrefStorage | undefined;
