import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { ICONS } from '../../constants';

const Header: React.FC = () => {
    const { currentUser, logout, theme, toggleTheme } = useAppContext();

    if (!currentUser) return null;

    return (
        <header className="bg-white dark:bg-slate-900 sticky top-0 z-20 border-b border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between p-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">MedFlow</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bem-vindo(a), {currentUser.name}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={toggleTheme} className="p-2 rounded-full text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                        {theme === 'light' ? ICONS.moon : ICONS.sun}
                    </button>
                    <button onClick={logout} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-bold text-gray-600 bg-gray-100 dark:bg-slate-800 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700">
                        <span>{ICONS.logout}</span>
                        <span className="hidden sm:inline">Sair</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;