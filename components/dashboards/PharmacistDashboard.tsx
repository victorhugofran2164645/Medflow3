import React, { useState, useMemo } from 'react';
import { Prescription, PrescriptionStatus } from '../../types';
import { mockPatients } from '../../constants';
import Card from '../shared/Card';
import PrescriptionValidationModal from '../pharmacist/PrescriptionValidationModal';

// This type is also used by the validation modal
export interface EnrichedPrescription extends Prescription {
    patientName: string;
    patientRoom: string;
    allergies: string[];
}

const PrescriptionItem: React.FC<{ 
    prescription: EnrichedPrescription; 
    onSelect: (prescription: EnrichedPrescription) => void 
}> = ({ prescription, onSelect }) => {
    const isPending = prescription.status === PrescriptionStatus.Pending;

    return (
        <li>
            <button
                onClick={() => onSelect(prescription)}
                disabled={!isPending}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                    isPending 
                        ? 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-400 dark:bg-slate-800 dark:border-slate-700' 
                        : 'bg-gray-50 border-gray-100 text-gray-500 dark:bg-slate-800/50 dark:border-transparent dark:text-gray-500 opacity-60 cursor-not-allowed'
                }`}
            >
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{prescription.medicationId} {prescription.dosage}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{prescription.patientName} - Quarto {prescription.patientRoom}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isPending ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-900' : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
                        {prescription.status}
                    </span>
                </div>
            </button>
        </li>
    );
};


const PharmacistDashboard: React.FC = () => {
    const initialPrescriptions = useMemo((): EnrichedPrescription[] => {
        const allPrescriptions: EnrichedPrescription[] = [];
        mockPatients.forEach(patient => {
            if (patient.prescriptions) {
                patient.prescriptions.forEach(p => {
                    allPrescriptions.push({
                        ...p,
                        patientName: patient.name,
                        patientRoom: patient.room,
                        allergies: patient.allergies,
                    });
                });
            }
        });
        return allPrescriptions.sort((a, b) => {
            if (a.status === PrescriptionStatus.Pending && b.status !== PrescriptionStatus.Pending) return -1;
            if (a.status !== PrescriptionStatus.Pending && b.status === PrescriptionStatus.Pending) return 1;
            return new Date(b.prescribedAt).getTime() - new Date(a.prescribedAt).getTime()
        });
    }, []);

    const [prescriptions, setPrescriptions] = useState<EnrichedPrescription[]>(initialPrescriptions);
    const [selectedPrescription, setSelectedPrescription] = useState<EnrichedPrescription | null>(null);

    const handleApprove = (prescriptionId: string) => {
        setPrescriptions(prev => prev.map(p => p.id === prescriptionId ? { ...p, status: PrescriptionStatus.Dispensed } : p));
        setSelectedPrescription(null);
    };

    const handleReject = (prescriptionId: string, reason: string) => {
        console.log(`Prescription ${prescriptionId} rejected. Reason: ${reason}`);
        setPrescriptions(prev => prev.map(p => p.id === prescriptionId ? { ...p, status: PrescriptionStatus.Cancelled } : p));
        setSelectedPrescription(null);
    };

    const pendingPrescriptions = prescriptions.filter(p => p.status === PrescriptionStatus.Pending);
    const processedPrescriptions = prescriptions.filter(p => p.status !== PrescriptionStatus.Pending);
    
    return (
        <div className="p-4 space-y-6 animate-fade-in">
             {selectedPrescription && (
                <PrescriptionValidationModal 
                    prescription={selectedPrescription}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onClose={() => setSelectedPrescription(null)}
                />
            )}
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Painel de Farmácia</h1>
            
            <Card title="Aguardando Validação">
                {pendingPrescriptions.length > 0 ? (
                    <ul className="space-y-4">
                        {pendingPrescriptions.map(p => (
                            <PrescriptionItem key={p.id} prescription={p} onSelect={setSelectedPrescription} />
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400 dark:text-gray-400 py-6 font-medium">Todas as prescrições foram validadas.</p>
                )}
            </Card>

            <Card title="Histórico Recente">
                 {processedPrescriptions.length > 0 ? (
                    <ul className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {processedPrescriptions.map(p => (
                            <PrescriptionItem key={p.id} prescription={p} onSelect={() => {}} />
                        ))}
                    </ul>
                ) : (
                     <p className="text-center text-gray-400 dark:text-gray-500 py-4">Nenhum histórico disponível.</p>
                )}
            </Card>
        </div>
    );
};

export default PharmacistDashboard;