import { useState } from 'react';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  // 🧭 Inicializamos el usuario directamente buscando en el localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('peritaje_user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  // 🧭 El estado loading solo será true si hay datos, pero el estado de usuario aún no se ha procesado
  const [loading, setLoading] = useState(false); 

  const login = (userData, token) => {
    setUser(userData);
    setLoading(false);
    localStorage.setItem('peritaje_user', JSON.stringify(userData));
    localStorage.setItem('peritaje_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('peritaje_user');
    localStorage.removeItem('peritaje_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}