
import React from 'react';
import Card from '../shared/Card';
import { StockFilter } from '../../types';
import { ICONS, mockMedicationStock, mockRecentActivity } from '../../constants';
import { UserRole } from '../../types';

const StatCard: React.FC<{ title: string; value: string; color: string; icon: React.ReactNode; onClick?: () => void }> = ({ title, value, color, icon, onClick }) => {
    const cardContent = (
        <div className={`text-white ${color} w-full h-full p-5 rounded-xl shadow-lg flex flex-col justify-between transition-transform hover:scale-[1.02]`}>
            <div className="flex justify-between items-start">
                <p className="text-sm font-medium opacity-90">{title}</p>
                <div className="opacity-80 p-2 bg-white/20 rounded-lg">{icon}</div>
            </div>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
    );

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className="w-full text-left focus:outline-none rounded-xl"
                aria-label={`Ver detalhes de ${title}`}
            >
                {cardContent}
            </button>
        );
    }

    return <Card className="w-full h-full p-0 border-0">{cardContent}</Card>;
};


const getRoleStyle = (role: UserRole) => {
    switch (role) {
        case UserRole.Admin: return { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };
        case UserRole.Doctor: return { bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' };
        case UserRole.Nurse: return { bg: 'bg-zinc-50 dark:bg-zinc-800', text: 'text-zinc-700 dark:text-zinc-300' };
        case UserRole.Pharmacist: return { bg: 'bg-stone-50 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300' };
        default: return { bg: 'bg-gray-50 dark:bg-slate-700', text: 'text-gray-600 dark:text-gray-300' };
    }
}

const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos";
    return "agora mesmo";
};

const StockStatusChart: React.FC<{ data: { good: number; low: number; critical: number } }> = ({ data }) => {
    const total = data.good + data.low + data.critical;
    if (total === 0) return null;

    const goodPercentage = (data.good / total) * 100;
    const lowPercentage = (data.low / total) * 100;
    const criticalPercentage = (data.critical / total) * 100;

    return (
        <Card title="Estado do Inventário">
            <div className="w-full h-8 flex rounded-full overflow-hidden my-4 bg-gray-100 dark:bg-slate-700">
                <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${goodPercentage}%` }} title={`Bom: ${data.good}`}></div>
                <div className="bg-amber-400 transition-all duration-500" style={{ width: `${lowPercentage}%` }} title={`Baixo: ${data.low}`}></div>
                <div className="bg-rose-500 transition-all duration-500" style={{ width: `${criticalPercentage}%` }} title={`Crítico: ${data.critical}`}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
                <div className="flex items-center"><span className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></span>Bom ({data.good})</div>
                <div className="flex items-center"><span className="h-3 w-3 rounded-full bg-amber-400 mr-2"></span>Baixo ({data.low})</div>
                <div className="flex items-center"><span className="h-3 w-3 rounded-full bg-rose-500 mr-2"></span>Crítico ({data.critical})</div>
            </div>
        </Card>
    );
};

interface AdminDashboardProps {
    setActiveTab: (tab: string) => void;
    setStockFilter: (filter: StockFilter) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab, setStockFilter }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stockStatus = mockMedicationStock.reduce((acc, item) => {
        const parts = item.expiryDate.split('-').map(part => parseInt(part, 10));
        const expiry = new Date(parts[0], parts[1] - 1, parts[2]);
        const isExpired = expiry < today;

        if (item.quantity === 0 || isExpired) {
            acc.critical += 1;
        } else if (item.quantity <= 300) {
            acc.low += 1;
        } else {
            acc.good += 1;
        }
        return acc;
    }, { good: 0, low: 0, critical: 0 });

    const totalStock = mockMedicationStock.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockCount = mockMedicationStock.filter(item => item.quantity > 0 && item.quantity <= 300).length;
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringSoonCount = mockMedicationStock.filter(item => {
        const expiry = new Date(item.expiryDate);
        return expiry < thirtyDaysFromNow && expiry >= today;
    }).length;

    const handleDownloadReport = () => {
        const headers = ["ID", "Medicamento", "Fabricante", "Dosagem", "Lote", "Validade", "Quantidade"];
        const rows = mockMedicationStock.map(item =>
            [item.id, item.name, item.manufacturer, item.dosage, item.lotNumber, item.expiryDate, item.quantity].join(",")
        );

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `medflow_relatorio_estoque_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4 space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Painel do Administrador</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                    title="Medicamentos" 
                    value={totalStock.toLocaleString('pt-BR')} 
                    color="bg-gradient-to-br from-slate-500 to-slate-700"
                    icon={ICONS.box}
                    onClick={() => { setStockFilter('all'); setActiveTab('stock'); }} 
                />
                <StatCard 
                    title="Stock Baixo" 
                    value={lowStockCount.toString()} 
                    color="bg-gradient-to-br from-amber-500 to-amber-700"
                    icon={React.cloneElement(ICONS.alertTriangle, { className: "h-6 w-6"})}
                    onClick={() => { setStockFilter('low_stock'); setActiveTab('stock'); }}
                />
                <StatCard 
                    title="A Expirar" 
                    value={expiringSoonCount.toString()} 
                    color="bg-gradient-to-br from-red-500 to-red-700"
                    icon={ICONS.calendar}
                    onClick={() => { setStockFilter('expiring_soon'); setActiveTab('stock'); }}
                />
                <StatCard 
                    title="Utilizadores" 
                    value="256" 
                    color="bg-gradient-to-br from-emerald-600 to-emerald-800"
                    icon={ICONS.users}
                    onClick={() => setActiveTab('userManagement')} 
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <StockStatusChart data={stockStatus} />
                </div>
                <div className="lg:col-span-2">
                     <Card title="Ações Rápidas">
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setActiveTab('userManagement')} className="p-4 text-sm font-semibold bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition shadow-md flex flex-col items-center justify-center gap-2">
                                {ICONS.users}
                                <span>Gerir Utilizadores</span>
                            </button>
                            <button onClick={handleDownloadReport} className="p-4 text-sm font-semibold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition flex flex-col items-center justify-center gap-2">
                                {ICONS.download}
                                <span>Salvar Relatórios</span>
                            </button>
                            <button onClick={() => alert('Funcionalidade em desenvolvimento.')} className="p-4 text-sm font-semibold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition flex flex-col items-center justify-center gap-2">
                                {ICONS.edit}
                                <span>Configurações</span>
                            </button>
                            <button onClick={() => setActiveTab('audit')} className="p-4 text-sm font-semibold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition flex flex-col items-center justify-center gap-2">
                                {ICONS.history}
                                <span>Auditoria</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            <Card title="Atividade Recente">
                <ul className="space-y-4">
                    {mockRecentActivity.map((log, index) => {
                        const style = getRoleStyle(log.userRole);
                        return (
                           <li key={index} className={`flex items-start space-x-4 p-4 rounded-xl border border-transparent ${style.bg} hover:border-gray-200 transition-colors`}>
                               <div className={`w-10 h-10 rounded-full flex-shrink-0 ${style.text} bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-sm shadow-sm`}>
                                   {log.userName.split(' ').map(n=>n[0]).join('').substring(0,2)}
                               </div>
                               <div className="flex-1">
                                   <p className="text-sm text-gray-800 dark:text-gray-200">
                                       <span className={`font-bold ${style.text}`}>{log.userName}</span>
                                       <span className="text-gray-600 dark:text-gray-400"> {log.action === 'Medicação Administrada' ? 'administrou' : log.action === 'Medicação Dispensada' ? 'dispensou' : log.action === 'Medicação Prescrita' ? 'prescreveu' : 'realizou a ação'} </span> 
                                       <span className="font-semibold text-gray-900 dark:text-white">{log.details.split(' para ')[0]}</span>.
                                   </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">{formatTimeAgo(log.timestamp)}</p>
                               </div>
                           </li>
                        )
                    })}
                </ul>
            </Card>
        </div>
    );
};

export default AdminDashboard;
