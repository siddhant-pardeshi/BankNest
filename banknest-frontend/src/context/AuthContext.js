import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getAccountDetails } from '../services/api';

const TOKEN_KEY = 'bn_token';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await getAccountDetails();
      setUser(response.data);
      return true;
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetchUserDetails().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUserDetails]);

  const loginAuth = async (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    setLoading(true);
    const ok = await fetchUserDetails();
    setLoading(false);
    return ok;
  };

  const refreshUser = () => {
    if (localStorage.getItem(TOKEN_KEY)) fetchUserDetails();
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAuth, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
