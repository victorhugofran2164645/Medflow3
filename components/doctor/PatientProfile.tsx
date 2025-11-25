import React, { useState, useEffect } from 'react';
import { Patient, Prescription, AdministrationRecord, PrescriptionStatus } from '../../types';
import Card from '../shared/Card';
import { ICONS } from '../../constants';

interface PatientProfileProps {
    patient: Patient;
    onBack: () => void;
}

const SuccessToast: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down text-center">
            {message}
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
            active
                ? 'border-b-2 border-gray-800 text-gray-900 dark:text-gray-100 dark:border-gray-200'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
    >
        {children}
    </button>
);

const Alert: React.FC<{ type: 'error' | 'warning', message: string }> = ({ type, message }) => {
    const isError = type === 'error';
    const bgColor = isError ? 'bg-red-50 dark:bg-red-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30';
    const textColor = isError ? 'text-red-700 dark:text-red-200' : 'text-yellow-700 dark:text-yellow-200';
    const iconColor = isError ? 'text-red-500' : 'text-yellow-500';

    return (
        <div className={`p-3 rounded-lg flex items-start space-x-2 ${bgColor}`}>
            <span className={iconColor}>{ICONS.alertTriangle}</span>
            <p className={`text-sm font-semibold ${textColor}`}>{message}</p>
        </div>
    );
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onBack }) => {
    const [activeTab, setActiveTab] = useState<'history' | 'prescribe'>('history');
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(patient.prescriptions || []);
    const [administrationHistory, setAdministrationHistory] = useState<AdministrationRecord[]>(
        (patient.administrationHistory || []).sort((a, b) => new Date(b.administeredAt).getTime() - new Date(a.administeredAt).getTime())
    );
    const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
    const [formState, setFormState] = useState({ medicationId: '', dosage: '', instructions: '' });
    const [alerts, setAlerts] = useState<{type: 'error' | 'warning', message: string}[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleEditClick = (prescription: Prescription) => {
        setEditingPrescription(prescription);
        setFormState({
            medicationId: prescription.medicationId,
            dosage: prescription.dosage,
            instructions: prescription.instructions,
        });
        setAlerts([]);
        setActiveTab('prescribe');
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleCancelPrescription = () => {
        setEditingPrescription(null);
        setFormState({ medicationId: '', dosage: '', instructions: '' });
        setAlerts([]);
        setActiveTab('history');
    };

    const handleSavePrescription = (e: React.FormEvent) => {
        e.preventDefault();
        const newAlerts: {type: 'error' | 'warning', message: string}[] = [];
        const medicationLower = formState.medicationId.toLowerCase();

        patient.allergies.forEach(allergy => {
            if (medicationLower.includes(allergy.toLowerCase())) {
                newAlerts.push({ type: 'error', message: `ALERTA DE ALERGIA: Paciente é alérgico a ${allergy}.` });
            }
        });
        
        if (prescriptions.some(p => p.medicationId.toLowerCase().includes('aspirina')) && medicationLower.includes('ibuprofeno')) {
            newAlerts.push({ type: 'warning', message: 'AVISO DE INTERAÇÃO: Risco aumentado de sangramento ao combinar Ibuprofeno com Aspirina.' });
        }

        setAlerts(newAlerts);

        if (newAlerts.some(a => a.type === 'error')) return;

        if (editingPrescription) {
            setPrescriptions(prev => prev.map(p => p.id === editingPrescription.id ? { ...p, ...formState } : p));
            const updateRecord: AdministrationRecord = {
                id: `adminrec_${Date.now()}`,
                medication: formState.medicationId,
                dosage: formState.dosage,
                administeredAt: new Date().toISOString(),
                administeredBy: 'Sistema',
                notes: 'Prescrição atualizada pelo(a) médico(a).'
            };
            setAdministrationHistory(prev => [updateRecord, ...prev]);
            setSuccessMessage('Prescrição atualizada com sucesso!');
        } else {
            const newPrescription: Prescription = {
                id: `presc_${Date.now()}`,
                patientId: patient.id,
                ...formState,
                prescribedById: 'doc01',
                prescribedAt: new Date().toISOString(),
                status: PrescriptionStatus.Pending,
            };
            setPrescriptions(prev => [...prev, newPrescription]);
            const creationRecord: AdministrationRecord = {
                id: `adminrec_${Date.now()}`,
                medication: newPrescription.medicationId,
                dosage: newPrescription.dosage,
                administeredAt: newPrescription.prescribedAt,
                administeredBy: 'Sistema',
                notes: 'Prescrição criada. Aguardando administração.'
            };
            setAdministrationHistory(prev => [creationRecord, ...prev]);
            setSuccessMessage('Nova prescrição salva com sucesso!');
        }
        setShowSuccess(true);
        handleCancelPrescription();
    };

    const renderHistory = () => (
        <div className="space-y-6">
            <Card title="Prescrições Ativas">
                <ul className="space-y-3">
                    {prescriptions.length > 0 ? (
                        prescriptions.map(p => (
                             <li key={p.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{p.medicationId} {p.dosage}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{p.instructions}</p>
                                        <p className="text-xs text-gray-400">Prescrito em: {new Date(p.prescribedAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${ p.status === PrescriptionStatus.Administered ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>{p.status}</span>
                                        <button onClick={() => handleEditClick(p)} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">{React.cloneElement(ICONS.edit, { className: "h-4 w-4"})}</button>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">Nenhuma prescrição ativa.</p>
                    )}
                </ul>
            </Card>

            <Card title="Histórico de Administração">
                 <ul className="space-y-3 max-h-60 overflow-y-auto">
                     {administrationHistory.length > 0 ? (
                        administrationHistory.map(record => {
                            const isSystemRecord = record.administeredBy === 'Sistema';
                            return (
                                <li key={record.id} className={`p-3 rounded-md ${isSystemRecord ? 'bg-gray-50 dark:bg-slate-700' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                                    <p className="font-semibold">{record.medication} {record.dosage}</p>
                                    <p className="text-xs text-gray-400">
                                        {isSystemRecord ? 'Evento em: ' : 'Administrado em: '}
                                        {new Date(record.administeredAt).toLocaleString()} por <strong>{record.administeredBy}</strong>
                                    </p>
                                    {record.notes && <p className={`text-sm mt-1 italic ${isSystemRecord ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>"{record.notes}"</p>}
                                </li>
                            );
                        })
                    ) : (
                         <p className="text-center text-gray-500 py-4">Nenhum histórico de administração.</p>
                    )}
                </ul>
            </Card>
        </div>
    );
    
    const renderPrescriptionForm = () => (
        <Card title={editingPrescription ? "Editar Prescrição" : "Nova Prescrição"}>
            <form onSubmit={handleSavePrescription} className="space-y-4">
                <div>
                    <label htmlFor="medicationId" className="block text-sm font-medium">Medicamento</label>
                    <input type="text" name="medicationId" id="medicationId" value={formState.medicationId} onChange={handleFormChange} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent" required />
                </div>
                 <div>
                    <label htmlFor="dosage" className="block text-sm font-medium">Posologia</label>
                    <input type="text" name="dosage" id="dosage" value={formState.dosage} onChange={handleFormChange} placeholder="Ex: 500mg" className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent" required />
                </div>
                 <div>
                    <label htmlFor="instructions" className="block text-sm font-medium">Instruções</label>
                    <textarea name="instructions" id="instructions" value={formState.instructions} onChange={handleFormChange} rows={3} placeholder="Ex: A cada 8 horas, por 7 dias" className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent" required />
                </div>

                {alerts.length > 0 && (
                    <div className="space-y-2">
                        {alerts.map((alert, index) => <Alert key={index} type={alert.type} message={alert.message} />)}
                    </div>
                )}

                <div className="flex justify-end items-center space-x-3 pt-4">
                     <button type="button" onClick={handleCancelPrescription} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Cancelar</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900">{editingPrescription ? 'Salvar Alterações' : 'Salvar Prescrição'}</button>
                </div>
            </form>
        </Card>
    );

    return (
        <div className="p-4 space-y-4 animate-fade-in">
             {showSuccess && <SuccessToast message={successMessage} onDismiss={() => setShowSuccess(false)} />}
            <div>
                <button onClick={onBack} className="text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4 flex items-center space-x-1">
                    <span>&larr;</span>
                    <span>Voltar à Lista de Pacientes</span>
                </button>
                <div className="md:flex justify-between items-start">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{patient.name}</h1>
                         <p className="text-gray-500 dark:text-gray-400">Quarto {patient.room}</p>
                    </div>
                </div>
                {patient.allergies.length > 0 && 
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center space-x-2">
                         <span className="text-red-500">{ICONS.alertTriangle}</span>
                        <p className="text-sm text-red-700 dark:text-red-200 font-semibold">
                           Alergias: {patient.allergies.join(', ')}
                        </p>
                    </div>
                }
            </div>
            
            <div className="border-b border-gray-200 dark:border-gray-700">
                <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>Histórico</TabButton>
                <TabButton active={activeTab === 'prescribe'} onClick={() => setActiveTab('prescribe')}>Prescrever</TabButton>
            </div>
            
            <div className="animate-fade-in">
                {activeTab === 'history' ? renderHistory() : renderPrescriptionForm()}
            </div>
        </div>
    );
};

export default PatientProfile;