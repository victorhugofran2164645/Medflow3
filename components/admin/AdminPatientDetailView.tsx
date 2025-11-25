import React from 'react';
import { Patient, Prescription, AdministrationRecord, PrescriptionStatus } from '../../types';
import Card from '../shared/Card';
import { ICONS } from '../../constants';

interface AdminPatientDetailViewProps {
    patient: Patient;
    onBack: () => void;
}

const AdminPatientDetailView: React.FC<AdminPatientDetailViewProps> = ({ patient, onBack }) => {
    
    const prescriptions = (patient.prescriptions || []).sort((a, b) => new Date(b.prescribedAt).getTime() - new Date(a.prescribedAt).getTime());
    const administrationHistory = (patient.administrationHistory || []).sort((a, b) => new Date(b.administeredAt).getTime() - new Date(a.administeredAt).getTime());

    return (
        <div className="p-4 space-y-4 animate-fade-in">
             <div>
                <button onClick={onBack} className="text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4 flex items-center space-x-1">
                    <span>&larr;</span>
                    <span>Voltar à Lista de Pacientes</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{patient.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">Quarto {patient.room}</p>
                
                {patient.allergies.length > 0 && 
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center space-x-2">
                         <span className="text-red-500">{ICONS.alertTriangle}</span>
                        <p className="text-sm text-red-700 dark:text-red-200 font-semibold">
                           Alergias: {patient.allergies.join(', ')}
                        </p>
                    </div>
                }
            </div>
            
            <Card title="Prescrições">
                {prescriptions.length > 0 ? (
                    <ul className="space-y-3 max-h-60 overflow-y-auto">
                        {prescriptions.map(p => (
                             <li key={p.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{p.medicationId} {p.dosage}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{p.instructions}</p>
                                        <p className="text-xs text-gray-400">Prescrito em: {new Date(p.prescribedAt).toLocaleString()}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${ p.status === PrescriptionStatus.Administered ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>{p.status}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhuma prescrição encontrada para este paciente.</p>
                )}
            </Card>

            <Card title="Histórico de Administração">
                 <ul className="space-y-3 max-h-60 overflow-y-auto">
                     {administrationHistory.length > 0 ? (
                        administrationHistory.map(record => (
                             <li key={record.id} className="p-3 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                <p className="font-semibold">{record.medication} {record.dosage}</p>
                                <p className="text-xs text-gray-400">
                                    Administrado em: {new Date(record.administeredAt).toLocaleString()} por <strong>{record.administeredBy}</strong>
                                </p>
                                {record.notes && <p className="text-sm mt-1 italic text-gray-600 dark:text-gray-300">"{record.notes}"</p>}
                            </li>
                        ))
                    ) : (
                         <p className="text-center text-gray-500 py-4">Nenhum histórico de administração encontrado.</p>
                    )}
                </ul>
            </Card>
        </div>
    );
};

export default AdminPatientDetailView;