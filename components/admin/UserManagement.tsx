import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../../types';
import { ICONS } from '../../constants';
import Card from '../shared/Card';

const mockUsers: User[] = [
    { id: 'doc01', name: 'Dr. James Carter', role: UserRole.Doctor },
    { id: 'nurse01', name: 'RN. Sarah Chen', role: UserRole.Nurse },
    { id: 'pharm01', name: 'RPh. Michael Lee', role: UserRole.Pharmacist },
    { id: 'doc02', name: 'Dr. Maria Garcia', role: UserRole.Doctor },
    { id: 'nurse02', name: 'RN. David Kim', role: UserRole.Nurse },
    { id: 'nurse03', name: 'RN. Patricia Miller', role: UserRole.Nurse },
    { id: 'pharm02', name: 'RPh. Linda Rodriguez', role: UserRole.Pharmacist },
];

const UserFormModal: React.FC<{
    user: Omit<User, 'id'> | User | null;
    onClose: () => void;
    onSave: (user: Omit<User, 'id'> | User) => void;
}> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user?.name || '');
    const [role, setRole] = useState(user?.role || UserRole.Doctor);
    const isEditing = user && 'id' in user;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() === '') return;
        
        const userData = { ...user, name, role };
        onSave(userData as User);
    };

    const availableRoles = Object.values(UserRole).filter(r => r !== UserRole.Admin);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
            <Card className="w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{isEditing ? 'Editar Utilizador' : 'Adicionar Novo Utilizador'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Função</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value as UserRole)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                                {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-transparent rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none">Salvar</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const ConfirmationModal: React.FC<{
    onConfirm: () => void;
    onCancel: () => void;
    userName: string;
}> = ({ onConfirm, onCancel, userName }) => {
    return (
         <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
            <Card className="w-full max-w-sm text-center">
                <h2 className="text-xl font-bold mb-2">Confirmar Exclusão</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Tem certeza que deseja excluir o utilizador <span className="font-bold">{userName}</span>? Esta ação não pode ser desfeita.</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onCancel} className="px-6 py-2 font-medium text-gray-700 dark:text-gray-200 bg-transparent rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
                    <button onClick={onConfirm} className="px-6 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Excluir</button>
                </div>
            </Card>
        </div>
    )
}

const UserManagement: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const filteredUsers = useMemo(() =>
        users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [users, searchTerm]);

    const handleSaveUser = (userToSave: Omit<User, 'id'> | User) => {
        if ('id' in userToSave) {
            // Edit user
            setUsers(users.map(u => u.id === userToSave.id ? userToSave : u));
        } else {
            // Add new user
            const newUser: User = { ...userToSave, id: `user_${Date.now()}` };
            setUsers([...users, newUser]);
        }
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const openAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };
    
    const openConfirmModal = (user: User) => {
        setDeletingUser(user);
        setIsConfirmOpen(true);
    };

    const handleDeleteUser = () => {
        if (deletingUser) {
            setUsers(users.filter(u => u.id !== deletingUser.id));
        }
        setIsConfirmOpen(false);
        setDeletingUser(null);
    };


    return (
        <div className="p-4 space-y-4">
            {isModalOpen && <UserFormModal user={editingUser} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} />}
            {isConfirmOpen && deletingUser && <ConfirmationModal onConfirm={handleDeleteUser} onCancel={() => setIsConfirmOpen(false)} userName={deletingUser.name}/>}
            
            <button onClick={() => setActiveTab('home')} className="text-sm text-gray-600 dark:text-gray-400 hover:underline mb-2">
                &larr; Voltar ao Painel
            </button>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Gestão de Utilizadores</h1>
                <button onClick={openAddModal} className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
                    <span>{ICONS.plus}</span>
                    <span>Adicionar Utilizador</span>
                </button>
            </div>
            
             <div className="sticky top-0 bg-gray-50 dark:bg-slate-900 py-2">
                <input
                    type="text"
                    placeholder="Procurar por nome do utilizador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800"/>
            </div>

            <Card>
                <ul className="space-y-3">
                    {filteredUsers.map(user => (
                        <li key={user.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => openEditModal(user)} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">{ICONS.edit}</button>
                                <button onClick={() => openConfirmModal(user)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">{ICONS.trash}</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default UserManagement;