import React, { useState, useMemo } from 'react';
import { MedicationStock as MedicationStockType, StockFilter } from '../../types';
import Card from './Card';
import { ICONS, mockMedicationStock } from '../../constants';

const getStatusColor = (quantity: number, expiryDate: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const parts = expiryDate.split('-').map(part => parseInt(part, 10));
    const expiry = new Date(parts[0], parts[1] - 1, parts[2]);

    const isExpired = expiry < today;
    
    // Vermelho: Stock baixo ou expirado
    if (quantity <= 300 || isExpired) {
        return 'border-l-4 border-l-red-500 bg-white dark:bg-slate-800 border-y border-r border-red-100 dark:border-red-900/30';
    }
    
    // Verde: Stock saudável - Estilo Gray/Clean
    return 'border-l-4 border-l-emerald-500 bg-white dark:bg-slate-800 border-y border-r border-gray-200 dark:border-slate-700';
};


const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const correctedDate = new Date(date.getTime() + userTimezoneOffset);

    const day = correctedDate.getDate().toString().padStart(2, '0');
    const month = (correctedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = correctedDate.getFullYear();
    return `${day}/${month}/${year}`;
};


const MedicationStockItem: React.FC<{ item: MedicationStockType }> = ({ item }) => (
    <li>
        <button
            onClick={() => alert(`A ver detalhes do stock para ${item.name} (Lote: ${item.lotNumber}).`)}
            className={`w-full text-left p-4 rounded-xl shadow-sm hover:shadow-md transition-all ${getStatusColor(item.quantity, item.expiryDate)}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-gray-800 dark:text-white">{item.name} <span className="font-medium text-sm text-gray-500 dark:text-gray-400 ml-1">{item.dosage}</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.manufacturer} <span className="mx-1">•</span> Lote: {item.lotNumber}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-xl text-gray-700 dark:text-gray-300">{item.quantity}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Exp: {formatDate(item.expiryDate)}</p>
                </div>
            </div>
        </button>
    </li>
);

interface MedicationStockProps {
    stockFilter: StockFilter;
    setStockFilter: (filter: StockFilter) => void;
}

const MedicationStock: React.FC<MedicationStockProps> = ({ stockFilter, setStockFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStock = useMemo(() => {
        let items = mockMedicationStock;

        if (stockFilter === 'low_stock') {
            items = items.filter(item => item.quantity <= 300 && item.quantity > 0);
        } else if (stockFilter === 'expiring_soon') {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            items = items.filter(item => {
                const expiry = new Date(item.expiryDate);
                return expiry < thirtyDaysFromNow && expiry >= today;
            });
        }

        if (searchTerm.trim() !== '') {
            const lowercasedTerm = searchTerm.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(lowercasedTerm) ||
                item.lotNumber.toLowerCase().includes(lowercasedTerm)
            );
        }
        return items;
    }, [stockFilter, searchTerm]);

    const filterMessages = {
        low_stock: 'A mostrar apenas medicamentos com stock baixo (300 unidades ou menos).',
        expiring_soon: 'A mostrar apenas medicamentos a expirar nos próximos 30 dias.',
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Stock</h1>
                <button
                    onClick={() => alert('A abrir formulário para adicionar novo stock de medicação.')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition shadow-sm font-semibold">
                    <span>{ICONS.plus}</span>
                    <span className="hidden sm:inline">Adicionar</span>
                </button>
            </div>

            {stockFilter !== 'all' && (
                <div className="flex items-center p-3 bg-white border border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 rounded-lg animate-fade-in shadow-sm">
                    <p className="text-sm font-semibold">
                        {filterMessages[stockFilter]}
                    </p>
                </div>
            )}

             <div className="sticky top-0 bg-gray-50 dark:bg-slate-900 py-2 z-10">
                <input
                    type="text"
                    placeholder="Procurar medicação por nome ou lote..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm transition-all"/>
            </div>
            <ul className="space-y-4">
                {filteredStock.length > 0
                    ? filteredStock.map(item => <MedicationStockItem key={item.stockId} item={item} />)
                    : <p className="text-center text-gray-500 dark:text-gray-400 py-6">Nenhum medicamento encontrado.</p>
                }
            </ul>
        </div>
    );
};

export default MedicationStock;