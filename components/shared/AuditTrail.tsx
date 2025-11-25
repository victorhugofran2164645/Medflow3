
import React from 'react';
import { AuditLog as AuditLogType, UserRole } from '../../types';

const mockAuditLogs: AuditLogType[] = [
    { id: 'log001', timestamp: '2023-10-27T10:05:00Z', userId: 'nurse01', userName: 'RN. Sarah Chen', userRole: UserRole.Nurse, action: 'Medicação Administrada', details: 'Administrou Paracetamol 500mg para John Doe (p001)' },
    { id: 'log002', timestamp: '2023-10-27T09:32:00Z', userId: 'pharm01', userName: 'RPh. Michael Lee', userRole: UserRole.Pharmacist, action: 'Medicação Dispensada', details: 'Dispensou a prescrição #presc001 para John Doe' },
    { id: 'log003', timestamp: '2023-10-27T09:01:00Z', userId: 'doc01', userName: 'Dr. James Carter', userRole: UserRole.Doctor, action: 'Medicação Prescrita', details: 'Prescreveu Paracetamol 500mg para John Doe (p001)' },
    { id: 'log004', timestamp: '2023-10-27T08:15:00Z', userId: 'admin01', userName: 'Dr. Evelyn Reed', userRole: UserRole.Admin, action: 'Login de Utilizador', details: 'Utilizador admin01 iniciou sessão com sucesso.' },
    { id: 'log005', timestamp: '2023-10-26T18:00:00Z', userId: 'pharm01', userName: 'RPh. Michael Lee', userRole: UserRole.Pharmacist, action: 'Atualização de Stock', details: 'Adicionou 1000 unidades de Paracetamol 500mg.' },
];

const getRoleColor = (role: UserRole) => {
    switch (role) {
        case UserRole.Admin: return 'text-purple-500';
        case UserRole.Doctor: return 'text-blue-500';
        case UserRole.Nurse: return 'text-yellow-500';
        case UserRole.Pharmacist: return 'text-green-500';
        default: return 'text-gray-500';
    }
}

const AuditLogItem: React.FC<{ log: AuditLogType }> = ({ log }) => (
    <li className="p-3 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
        <div className="flex justify-between items-start text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>{new Date(log.timestamp).toLocaleString()}</span>
            <span className={`font-bold ${getRoleColor(log.userRole)}`}>{log.userRole}</span>
        </div>
        <p><span className="font-semibold">{log.userName}</span> realizou a ação: <span className="font-semibold text-primary-600 dark:text-primary-400">{log.action}</span></p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{log.details}</p>
    </li>
);

const AuditTrail: React.FC = () => {
    return (
        <div className="p-4 space-y-4">
             <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pista de Auditoria</h1>
             <div className="sticky top-0 bg-gray-50 dark:bg-black py-2">
                 <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Filtrar por utilizador ou ação..." className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800"/>
                    <input type="date" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800"/>
                 </div>
            </div>
            <ul className="space-y-3">
                {mockAuditLogs.map(log => <AuditLogItem key={log.id} log={log} />)}
            </ul>
        </div>
    );
};

export default AuditTrail;
