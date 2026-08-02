import apiClient from './apiClient';
import { AuthResponse } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', payload);
    return response.data;
  },

  sendOtp: async (phone: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/api/auth/otp/send', { phone });
    return response.data;
  },

  verifyOtp: async (phone: string, otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/otp/verify', { phone, otp });
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<AuthResponse> => {
    const response = await apiClient.put<AuthResponse>('/api/auth/profile', payload);
    return response.data;
  },
};
