import axios from 'axios';
import { cacheStore, CACHE_KEYS } from './cache';

const CACHE_TTL = 30 * 60 * 1000;

const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

export interface FetchResult {
  data: any;
  fromCache: boolean;
}

export const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    await cacheStore.set(CACHE_KEYS.PRODUCTS, response.data, CACHE_TTL);
    return { data: response.data, fromCache: false };
  } catch {
    const cached = await cacheStore.get(CACHE_KEYS.PRODUCTS, true);
    if (cached) {
      return { data: cached, fromCache: true };
    }
    throw new Error('No internet connection and no cached data available.');
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    await cacheStore.set(CACHE_KEYS.CATEGORIES, response.data, CACHE_TTL);
    return { data: response.data, fromCache: false };
  } catch {
    const cached = await cacheStore.get(CACHE_KEYS.CATEGORIES, true);
    if (cached) {
      return { data: cached, fromCache: true };
    }
    throw new Error('No internet connection and no cached data available.');
  }
};
