import React, { useState, useMemo } from 'react';
import { Patient } from '../../types';
import { mockPatients } from '../../constants';

interface PatientListProps {
    onSelectPatient: (patient: Patient) => void;
}

const PatientList: React.FC<PatientListProps> = ({ onSelectPatient }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = useMemo(() => {
        if (!searchTerm) return mockPatients;
        const lowercasedTerm = searchTerm.toLowerCase();
        return mockPatients.filter(p => 
            p.name.toLowerCase().includes(lowercasedTerm) ||
            p.room.toLowerCase().includes(lowercasedTerm)
        );
    }, [searchTerm]);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Lista de Pacientes</h1>
            <div className="sticky top-0 bg-gray-50 dark:bg-slate-900 py-2 z-10">
                 <input
                    type="text"
                    placeholder="Procurar por nome ou quarto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm transition-all"/>
            </div>
            <ul className="space-y-4">
                {filteredPatients.map(patient => (
                    <li key={patient.id}>
                        <button
                            onClick={() => onSelectPatient(patient)}
                            className="w-full text-left p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
                        >
                             <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{patient.name}</p>
                             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Quarto {patient.room}</p>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientList;