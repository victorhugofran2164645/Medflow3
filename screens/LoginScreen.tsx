import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { User, UserRole } from '../types';

const MOCK_USERS: User[] = [
    { id: 'admin01', name: 'Dr. Evelyn Reed', role: UserRole.Admin },
    { id: 'doc01', name: 'Dr. James Carter', role: UserRole.Doctor },
    { id: 'nurse01', name: 'RN. Sarah Chen', role: UserRole.Nurse },
    { id: 'pharm01', name: 'RPh. Michael Lee', role: UserRole.Pharmacist },
];

const RoleCard: React.FC<{ user: User; onSelect: (user: User) => void }> = ({ user, onSelect }) => (
    <button
        onClick={() => onSelect(user)}
        className="w-full text-left p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{user.role}</h3>
        <p className="text-gray-600 dark:text-gray-400">Entrar como {user.name}</p>
    </button>
);

const LoginForm: React.FC<{ user: User; onLogin: (user: User) => void; onBack: () => void }> = ({ user, onLogin, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.length !== 11) {
            setError('O login deve conter exatamente 11 dígitos.');
            return;
        }
        if (password.length !== 8) {
            setError('A senha deve conter exatamente 8 dígitos.');
            return;
        }
        setError('');
        onLogin(user);
    };

    const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, maxLength: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= maxLength) {
            setter(value);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 animate-fade-in">
            <button onClick={onBack} className="text-sm text-gray-600 dark:text-gray-400 hover:underline mb-6 flex items-center">
                 &larr; Voltar à seleção
            </button>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Entrar como {user.role}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{user.name}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Login (11 dígitos)</label>
                    <input
                        id="username"
                        type="tel"
                        value={username}
                        onChange={handleNumericInputChange(setUsername, 11)}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg"
                        placeholder="Introduza os 11 dígitos"
                        autoComplete="username"
                        maxLength={11}
                        pattern="\d{11}"
                        title="O login deve conter 11 dígitos numéricos."
                    />
                </div>
                <div>
                    <label htmlFor="password"  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Senha (8 dígitos)</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handleNumericInputChange(setPassword, 8)}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg"
                        placeholder="Introduza os 8 dígitos"
                        autoComplete="current-password"
                        maxLength={8}
                        pattern="\d{8}"
                        title="A senha deve conter 8 dígitos numéricos."
                        inputMode="numeric"
                    />
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
                <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                    Entrar
                </button>
            </form>
        </div>
    );
};


const LoginScreen: React.FC = () => {
    const { login } = useAppContext();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
    };

    const handleBack = () => {
        setSelectedUser(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 p-4 transition-colors duration-200">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">MedFlow</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Sistema de Gestão Hospitalar</p>
                </div>
                
                {selectedUser ? (
                    <LoginForm user={selectedUser} onLogin={login} onBack={handleBack} />
                ) : (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 animate-fade-in">
                        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Selecione Seu Perfil</h2>
                        <div className="space-y-4">
                            {MOCK_USERS.map((user) => (
                                <RoleCard key={user.id} user={user} onSelect={handleSelectUser} />
                            ))}
                        </div>
                    </div>
                )}
                 <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
                    Ambiente de Demonstração
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;