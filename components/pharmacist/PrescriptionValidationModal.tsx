import React, { useState, useMemo } from 'react';
import { PrescriptionStatus } from '../../types';
import { ICONS, mockMedicationStock } from '../../constants';
import Card from '../shared/Card';
import { EnrichedPrescription } from '../dashboards/PharmacistDashboard';

interface ValidationModalProps {
    prescription: EnrichedPrescription;
    onApprove: (prescriptionId: string) => void;
    onReject: (prescriptionId: string, reason: string) => void;
    onClose: () => void;
}

const Alert: React.FC<{ type: 'error' | 'warning' | 'info', message: string, details?: string }> = ({ type, message, details }) => {
    const colors = {
        error: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-200', icon: 'text-red-500' },
        warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-200', icon: 'text-yellow-500' },
        info: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-200', icon: 'text-blue-500' },
    };
    const selectedColor = colors[type];

    return (
        <div className={`p-3 rounded-lg flex items-start space-x-2 ${selectedColor.bg}`}>
            <span className={selectedColor.icon}>{ICONS.alertTriangle}</span>
            <div>
                <p className={`text-sm font-semibold ${selectedColor.text}`}>{message}</p>
                {details && <p className={`text-xs ${selectedColor.text} opacity-80`}>{details}</p>}
            </div>
        </div>
    );
};


const PrescriptionValidationModal: React.FC<ValidationModalProps> = ({ prescription, onApprove, onReject, onClose }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(false);

    const validationResults = useMemo(() => {
        const alerts: { type: 'error' | 'warning' | 'info', message: string, details?: string }[] = [];
        const stockItem = mockMedicationStock.find(item => item.name.toLowerCase() === prescription.medicationId.toLowerCase());

        // 1. Stock Check
        if (!stockItem || stockItem.quantity <= 0) {
            alerts.push({ type: 'error', message: 'Medicamento Fora de Stock', details: `Não há ${prescription.medicationId} disponível no inventário.` });
        } else if (stockItem.quantity < 10) {
             alerts.push({ type: 'warning', message: 'Stock Baixo', details: `Restam apenas ${stockItem.quantity} unidades.` });
        } else {
            alerts.push({ type: 'info', message: 'Stock Disponível', details: `Quantidade em stock: ${stockItem.quantity}` });
        }
        
        // 2. Allergy Check
        prescription.allergies.forEach(allergy => {
            if (prescription.medicationId.toLowerCase().includes(allergy.toLowerCase())) {
                alerts.push({ type: 'error', message: 'Conflito de Alergia Grave', details: `O paciente é alérgico a ${allergy}.` });
            }
        });

        // 3. Simple Interaction Check (Simulated)
        if (prescription.medicationId.toLowerCase().includes('ibuprofeno') && prescription.allergies.includes('Aspirina')) {
             alerts.push({ type: 'warning', message: 'Interação Medicamentosa Potencial', details: `Risco de sensibilidade cruzada entre Ibuprofeno e Aspirina.` });
        }
        
        const hasErrors = alerts.some(a => a.type === 'error');
        return { alerts, hasErrors };

    }, [prescription]);

    const handleRejectClick = () => {
        if (showRejectionInput && rejectionReason.trim()) {
            onReject(prescription.id, rejectionReason);
        } else {
            setShowRejectionInput(true);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
            <Card className="w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold">Validar Prescrição</h2>
                     <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
                </div>
                
                <div className="overflow-y-auto pr-2 flex-1">
                    {/* Prescription Details */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-4 space-y-2">
                        <p><strong>Paciente:</strong> {prescription.patientName} (Quarto {prescription.patientRoom})</p>
                        <p><strong>Medicamento:</strong> {prescription.medicationId} {prescription.dosage}</p>
                        <p><strong>Instruções:</strong> {prescription.instructions}</p>
                         {prescription.allergies.length > 0 && <p className="text-red-500 font-semibold"><strong>Alergias:</strong> {prescription.allergies.join(', ')}</p>}
                    </div>

                    {/* Validation Checks */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Verificações do Sistema</h3>
                        {validationResults.alerts.map((alert, index) => (
                            <Alert key={index} type={alert.type} message={alert.message} details={alert.details}/>
                        ))}
                    </div>
                     {showRejectionInput && (
                        <div className="mt-4 animate-fade-in">
                            <label htmlFor="rejectionReason" className="block text-sm font-medium">Motivo da Rejeição</label>
                            <textarea
                                id="rejectionReason"
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                                placeholder="Ex: Dosagem incorreta, conflito de alergia..."
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-end space-x-3">
                    <button
                        onClick={handleRejectClick}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        disabled={showRejectionInput && !rejectionReason.trim()}
                    >
                        {showRejectionInput ? 'Confirmar Rejeição' : 'Rejeitar'}
                    </button>
                    <button
                        onClick={() => onApprove(prescription.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={validationResults.hasErrors}
                    >
                        Aprovar e Dispensar
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default PrescriptionValidationModal;