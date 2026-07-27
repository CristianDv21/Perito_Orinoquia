import { useState } from 'react';
import Login from './login/login';
import Dashboard from "./dashboard/dashboard.jsx";
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 1. Extraemos la función logout del contexto
  const { user, logout } = useAuth();

  // Función que se ejecuta cuando el Login es exitoso
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // 2. Función para cerrar sesión limpiando el almacenamiento y el contexto
  const handleLogout = () => {
    setIsAuthenticated(false);
    logout(); // Esto borra las llaves del localStorage y desloguea globalmente
  };

  // Si hay un usuario en el contexto o en el estado local, mostramos el dashboard
  const showDashboard = isAuthenticated || user;

  return (
    <>
      {showDashboard ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}