import apiClient from './apiClient';
import { Product, PageableResponse, Category } from '../types';

export const productService = {
  getProducts: async (page = 0, size = 20): Promise<PageableResponse<Product>> => {
    const response = await apiClient.get<PageableResponse<Product>>(`/api/products?page=${page}&size=${size}`);
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/api/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await apiClient.get<any>(`/api/products/category/${categoryId}?size=100`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.content || [];
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/categories');
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get<any>(`/api/products/search?q=${encodeURIComponent(query)}&size=100`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.content || [];
  },

  extractCategoriesFromProducts: (products: Product[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    products.forEach((p) => {
      if (p.categoryId && p.categoryName && !categoryMap.has(p.categoryId)) {
        categoryMap.set(p.categoryId, {
          id: p.categoryId,
          name: p.categoryName,
        });
      }
    });
    return Array.from(categoryMap.values());
  },
};
