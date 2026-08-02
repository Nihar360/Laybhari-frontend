import apiClient from './apiClient';
import { Address, AddressRequest } from '../types';

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get<Address[]>('/api/addresses');
    return response.data;
  },

  addAddress: async (data: AddressRequest): Promise<Address> => {
    const response = await apiClient.post<Address>('/api/addresses', data);
    return response.data;
  },

  updateAddress: async (id: number, data: AddressRequest): Promise<Address> => {
    const response = await apiClient.put<Address>(`/api/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/addresses/${id}`);
  },
};
