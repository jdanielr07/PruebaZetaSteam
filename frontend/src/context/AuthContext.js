'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { token, role }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    if (token && role) {
      setUser({ token, role, username });
    }
  }, []);

  const login = async (username, password) => {
    const res = await axios.post('http://localhost:4000/api/auth/login', { username, password });
    const token = res.data.token;
    const payload = JSON.parse(atob(token.split('.')[1]));

    localStorage.setItem('token', token);
    localStorage.setItem('role', payload.role);
    localStorage.setItem('username', payload.username);
    setUser({ token, role: payload.role, username: payload.username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
