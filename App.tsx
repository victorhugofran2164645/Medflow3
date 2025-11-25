
import React, { useState, useEffect, useMemo } from 'react';
import { AppContextProvider } from './contexts/AppContext';
import LoginScreen from './screens/LoginScreen';
import MainLayout from './screens/MainLayout';
import { User, UserRole } from './types';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = window.localStorage.getItem('theme');
            return (storedTheme === 'dark' || storedTheme === 'light') ? storedTheme : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const contextValue = useMemo(() => ({
        currentUser,
        theme,
        login: handleLogin,
        logout: handleLogout,
        toggleTheme
    }), [currentUser, theme]);

    return (
        <AppContextProvider value={contextValue}>
            <div className="font-sans antialiased text-gray-900 dark:text-gray-100">
                {currentUser ? <MainLayout /> : <LoginScreen />}
            </div>
        </AppContextProvider>
    );
};

export default App;
