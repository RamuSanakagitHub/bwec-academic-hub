import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// On mobile (Capacitor), VITE_API_URL is the machine IP. On web dev, empty → Vite proxy handles it.
const API_BASE = import.meta.env.VITE_API_URL || '';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bwec_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.defaults.baseURL = API_BASE;
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('bwec_user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally { setLoading(false); }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', formData);
      setUser(data);
      localStorage.setItem('bwec_user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally { setLoading(false); }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bwec_user');
  };

  const fetchSubjects = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`/api/subjects?${params}`);
      setSubjects(data);
      return data;
    } catch { return []; }
  };

  return (
    <AppContext.Provider value={{ user, loading, subjects, login, register, logout, fetchSubjects, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
