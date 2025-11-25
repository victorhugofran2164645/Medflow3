import React from 'react';
import { Patient } from '../../types';
import { mockPatients } from '../../constants';
import Card from '../shared/Card';

interface DoctorDashboardProps {
    onSelectPatient: (patient: Patient) => void;
}

const PatientListItem: React.FC<{ patient: Patient; onSelect: (patient: Patient) => void }> = ({ patient, onSelect }) => (
    <li>
        <button
            onClick={() => onSelect(patient)}
            className="w-full text-left p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm hover:shadow-md group"
        >
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-gray-200">{patient.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quarto {patient.room}</p>
                </div>
                {patient.allergies.length > 0 && (
                    <span className="text-xs font-bold text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/40 px-3 py-1 rounded-full border border-red-100 dark:border-red-900">
                        {patient.allergies.length} Alergia(s)
                    </span>
                )}
            </div>
        </button>
    </li>
);

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onSelectPatient }) => {
    return (
        <div className="p-4 space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Painel do Médico</h1>
            <Card title="Meus Pacientes">
                <ul className="space-y-4">
                    {mockPatients.map(patient => (
                        <PatientListItem key={patient.id} patient={patient} onSelect={onSelectPatient} />
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default DoctorDashboard;