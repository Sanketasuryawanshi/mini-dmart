import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dmart_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('dmart_token');
      const storedUser = localStorage.getItem('dmart_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('dmart_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error('Session refresh error:', err);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const data = res.data.data;
        const userData = {
          id: data.id,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          phone: data.phone,
          address: data.address,
          pincode: data.pincode,
        };

        setToken(data.token);
        setUser(userData);
        localStorage.setItem('dmart_token', data.token);
        localStorage.setItem('dmart_user', JSON.stringify(userData));
        toast.success(`Welcome back, ${data.fullName}!`);
        return { success: true, role: data.role };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (registerData) => {
    try {
      const res = await api.post('/auth/register', registerData);
      if (res.data.success) {
        const data = res.data.data;
        const userData = {
          id: data.id,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          phone: data.phone,
          address: data.address,
          pincode: data.pincode,
        };

        setToken(data.token);
        setUser(userData);
        localStorage.setItem('dmart_token', data.token);
        localStorage.setItem('dmart_user', JSON.stringify(userData));
        toast.success('Account created successfully!');
        return { success: true, role: data.role };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dmart_token');
    localStorage.removeItem('dmart_user');
    toast.success('Logged out successfully');
  };

  const isAdmin = () => user?.role === 'ROLE_ADMIN';
  const isStaff = () => user?.role === 'ROLE_STAFF' || user?.role === 'ROLE_ADMIN';
  const isCustomer = () => user?.role === 'ROLE_CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isStaff,
        isCustomer,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
