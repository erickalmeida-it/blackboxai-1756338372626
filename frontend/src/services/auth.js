import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('procultura_token');
    const userData = localStorage.getItem('procultura_user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('procultura_token', data.token);
        localStorage.setItem('procultura_user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: 'Credenciais inválidas' };
      }
    } catch (error) {
      // For demo purposes, allow login with demo credentials
      if (email === 'admin@procultura.rs.gov.br' && password === 'admin123') {
        const mockUser = {
          id: 1,
          name: 'Administrador',
          email: 'admin@procultura.rs.gov.br',
          role: 'admin'
        };
        const mockToken = 'demo_token_' + Date.now();
        
        localStorage.setItem('procultura_token', mockToken);
        localStorage.setItem('procultura_user', JSON.stringify(mockUser));
        setIsAuthenticated(true);
        setUser(mockUser);
        return { success: true };
      }
      
      return { success: false, error: 'Erro de conexão. Use admin@procultura.rs.gov.br / admin123 para demo.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('procultura_token');
    localStorage.removeItem('procultura_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('procultura_token');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    getToken,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
