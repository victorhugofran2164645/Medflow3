import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { UserRole } from '../../types';
import { ICONS } from '../../constants';

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; name: string; active: boolean; onClick: () => void }> = ({ icon, label, name, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-3 pb-2 transition-colors duration-200 ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}`}>
        {icon}
        <span className="text-[10px] font-semibold mt-1 uppercase tracking-wide">{label}</span>
        <div className={`w-12 h-1 mt-1 rounded-full transition-all duration-300 ${active ? 'bg-gray-800 dark:bg-gray-200' : 'bg-transparent'}`}></div>
    </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const { currentUser } = useAppContext();

    const navItems = [
        { name: 'home', label: 'Início', icon: ICONS.home, roles: [UserRole.Admin, UserRole.Doctor, UserRole.Nurse, UserRole.Pharmacist] },
        { name: 'stock', label: 'Stock', icon: ICONS.pills, roles: [UserRole.Admin, UserRole.Pharmacist] },
        { name: 'patients', label: 'Pacientes', icon: ICONS.users, roles: [UserRole.Admin, UserRole.Nurse] },
        { name: 'audit', label: 'Auditoria', icon: ICONS.history, roles: [UserRole.Admin] },
    ];
    
    const availableItems = navItems.filter(item => currentUser && item.roles.includes(currentUser.role));

    if (!currentUser) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <div className="flex justify-around">
                {availableItems.map(item => (
                    <NavItem
                        key={item.name}
                        name={item.name}
                        label={item.label}
                        icon={item.icon}
                        active={activeTab === item.name}
                        onClick={() => setActiveTab(item.name)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BottomNav;