import apiClient from './apiClient';
import { Order, CheckoutRequest, CreatePaymentResponse, VerifyPaymentRequest } from '../types';

export const orderService = {
  checkout: async (data: CheckoutRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/api/orders/checkout', data);
    return response.data;
  },

  createPayment: async (orderId: number): Promise<CreatePaymentResponse> => {
    const response = await apiClient.post<CreatePaymentResponse>(`/api/orders/${orderId}/create-payment`);
    return response.data;
  },

  verifyPayment: async (orderId: number, data: VerifyPaymentRequest): Promise<Order> => {
    const response = await apiClient.post<Order>(`/api/orders/${orderId}/verify-payment`, data);
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/api/orders');
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/api/orders/${id}`);
    return response.data;
  },
};
