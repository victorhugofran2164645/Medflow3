
import React, { createContext, useContext } from 'react';
import { User } from '../types';

interface AppContextType {
    currentUser: User | null;
    theme: 'light' | 'dark';
    login: (user: User) => void;
    logout: () => void;
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ value: AppContextType; children: React.ReactNode }> = ({ value, children }) => {
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};
