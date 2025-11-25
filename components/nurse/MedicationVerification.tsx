import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { Task } from '../../types';
import Card from '../shared/Card';

interface MedicationVerificationProps {
    task: Task;
    onConfirm: (taskId: string, notes: string) => void;
    onCancel: () => void;
}

const MedicationVerification: React.FC<MedicationVerificationProps> = ({ task, onConfirm, onCancel }) => {
    const [notes, setNotes] = useState('');
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
            <Card className="w-full max-w-sm">
                <h2 className="text-xl font-bold text-center mb-4">Verificar Medicação</h2>
                
                <div className="space-y-3 text-center">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Paciente</p>
                        <p className="text-lg font-semibold">{task.patientName} (Quarto {task.room})</p>
                    </div>
                    <hr className="dark:border-gray-700"/>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Medicação</p>
                        <p className="text-lg font-semibold">{task.medication} {task.dosage}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Horário Agendado</p>
                        <p className={`text-lg font-semibold ${task.overdue ? 'text-red-500' : ''}`}>{task.time}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações (Opcional)</label>
                    <textarea
                        id="notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ex: Paciente relatou náuseas..."
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                </div>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => onConfirm(task.id, notes)}
                        className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform hover:scale-105"
                    >
                        {ICONS.check}
                        <span>Confirmar Administração</span>
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Cancelar
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default MedicationVerification;