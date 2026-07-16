import { useState } from 'react';
import Login from './login/login';
import Dashboard from "./dashboard/dashboard.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función que se ejecuta cuando el Login es exitoso
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;