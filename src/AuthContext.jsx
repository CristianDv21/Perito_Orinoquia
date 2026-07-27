/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('peritaje_user');
            const storedToken = localStorage.getItem('peritaje_token');
            return (storedUser && storedToken) ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error al leer el localStorage:", error);
            return null;
        }
    });

    const [loading] = useState(false);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('peritaje_user', JSON.stringify(userData));
        localStorage.setItem('peritaje_token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('peritaje_user');
        localStorage.removeItem('peritaje_token');
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}