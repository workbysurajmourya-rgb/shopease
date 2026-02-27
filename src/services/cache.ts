import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@shopease_cache_';
const CACHE_META_SUFFIX = '_meta';

interface CacheMeta {
  timestamp: number;
  ttl: number;
}

const getCacheKey = (key: string) => `${CACHE_PREFIX}${key}`;
const getMetaKey = (key: string) => `${CACHE_PREFIX}${key}${CACHE_META_SUFFIX}`;

export const cacheStore = {
  async set(key: string, data: any, ttlMs: number = 30 * 60 * 1000): Promise<void> {
    try {
      const meta: CacheMeta = { timestamp: Date.now(), ttl: ttlMs };
      await AsyncStorage.multiSet([
        [getCacheKey(key), JSON.stringify(data)],
        [getMetaKey(key), JSON.stringify(meta)],
      ]);
    } catch {}
  },

  async get(key: string, ignoreExpiry = false): Promise<any | null> {
    try {
      const [[, rawData], [, rawMeta]] = await AsyncStorage.multiGet([
        getCacheKey(key),
        getMetaKey(key),
      ]);

      if (!rawData) return null;

      if (!ignoreExpiry && rawMeta) {
        const meta: CacheMeta = JSON.parse(rawMeta);
        if (Date.now() - meta.timestamp > meta.ttl) return null;
      }

      return JSON.parse(rawData);
    } catch {
      return null;
    }
  },

  async getWithAge(key: string): Promise<{ data: any; ageMs: number } | null> {
    try {
      const [[, rawData], [, rawMeta]] = await AsyncStorage.multiGet([
        getCacheKey(key),
        getMetaKey(key),
      ]);

      if (!rawData) return null;

      const data = JSON.parse(rawData);
      const ageMs = rawMeta ? Date.now() - JSON.parse(rawMeta).timestamp : Infinity;

      return { data, ageMs };
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch {}
  },
};

export const CACHE_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
};
