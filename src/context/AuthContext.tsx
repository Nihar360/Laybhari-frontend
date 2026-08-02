import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  setAuthData: (res: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('laybhari_token');
    const savedUser = localStorage.getItem('laybhari_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user credentials', err);
      }
    }
    setIsLoading(false);
  }, []);

  const setAuthData = (res: AuthResponse) => {
    const userInfo: User = {
      userId: res.userId,
      name: res.name,
      email: res.email,
      phone: res.phone,
      role: res.role,
    };

    localStorage.setItem('laybhari_token', res.token);
    localStorage.setItem('laybhari_user', JSON.stringify(userInfo));

    setToken(res.token);
    setUser(userInfo);
  };

  const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await authService.login(payload);
    setAuthData(res);
    return res;
  };

  const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await authService.register(payload);
    setAuthData(res);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('laybhari_token');
    localStorage.removeItem('laybhari_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
