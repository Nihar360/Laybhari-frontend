import apiClient from './apiClient';
import { CartResponse } from '../types';

export interface AddToCartPayload {
  productVariantId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    const response = await apiClient.get<CartResponse>('/api/cart');
    return response.data;
  },

  addToCart: async (payload: AddToCartPayload): Promise<CartResponse> => {
    const response = await apiClient.post<CartResponse>('/api/cart', payload);
    return response.data;
  },

  updateCartItem: async (cartItemId: number, payload: UpdateCartItemPayload): Promise<CartResponse> => {
    const response = await apiClient.put<CartResponse>(`/api/cart/${cartItemId}`, payload);
    return response.data;
  },

  removeCartItem: async (cartItemId: number): Promise<CartResponse> => {
    const response = await apiClient.delete<CartResponse>(`/api/cart/${cartItemId}`);
    return response.data;
  },
};
