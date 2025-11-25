import React, { useState } from 'react';
import { Task } from '../../types';
import { mockTasks } from '../../constants';
import Card from '../shared/Card';
import { ICONS } from '../../constants';
import QRScanner from '../nurse/QRScanner';
import MedicationVerification from '../nurse/MedicationVerification';

const TaskItem: React.FC<{ task: Task; onStart: (task: Task) => void }> = ({ task, onStart }) => {
    const isCompleted = !!task.completedAt;
    const isOverdue = !!task.overdue && !isCompleted;

    return (
        <li className={`p-4 rounded-xl flex items-center justify-between transition-all shadow-sm ${
            isCompleted ? 'bg-gray-50 border border-gray-200 dark:bg-emerald-900/20 dark:border-emerald-900/30 opacity-70' : 
            isOverdue ? 'bg-white border-l-4 border-l-red-500 border-y border-r border-gray-200 dark:bg-red-900/10 dark:border-red-900/50' : 
            'bg-white border border-gray-200 hover:border-gray-400 dark:bg-slate-800 dark:border-slate-700'
        }`}>
            <div>
                <p className={`font-bold text-lg ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-100'}`}>{task.medication} {task.dosage}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{task.patientName} <span className="text-gray-400 font-normal">|</span> Quarto {task.room}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">Horário: {task.time}</p>
            </div>
            {!isCompleted ? (
                 <button
                    onClick={() => onStart(task)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-white bg-gray-700 hover:bg-gray-800 rounded-lg shadow-md transition-colors"
                >
                    <span>Administrar</span>
                </button>
            ) : (
                <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900">
                    {ICONS.check}
                    <span className="text-sm font-bold">Concluído</span>
                </div>
            )}
        </li>
    );
};

const NurseDashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [isScanning, setIsScanning] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    const handleStartTask = (task: Task) => {
        setCurrentTask(task);
        setIsScanning(true);
    };

    const handleScanSuccess = () => {
        setIsScanning(false);
        setIsVerifying(true);
    };

    const handleConfirmAdministration = (taskId: string, notes: string) => {
        setTasks(prevTasks => prevTasks.map(t => 
            t.id === taskId ? { ...t, completedAt: new Date().toISOString(), overdue: false } : t
        ));
        setIsVerifying(false);
        setCurrentTask(null);
    };

    const handleCancel = () => {
        setIsScanning(false);
        setIsVerifying(false);
        setCurrentTask(null);
    };

    const upcomingTasks = tasks.filter(t => !t.completedAt);
    const completedTasks = tasks.filter(t => t.completedAt);

    return (
        <div className="p-4 space-y-6 animate-fade-in">
            {isScanning && <QRScanner taskToVerify={currentTask} onScanSuccess={handleScanSuccess} onClose={handleCancel} />}
            {isVerifying && currentTask && <MedicationVerification task={currentTask} onConfirm={handleConfirmAdministration} onCancel={handleCancel} />}
            
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Painel de Enfermagem</h1>
            
            <Card title="Tarefas Pendentes">
                {upcomingTasks.length > 0 ? (
                    <ul className="space-y-4">
                        {upcomingTasks.map(task => (
                            <TaskItem key={task.id} task={task} onStart={handleStartTask} />
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400 dark:text-gray-400 py-6 font-medium">Nenhuma tarefa pendente.</p>
                )}
            </Card>

            <Card title="Concluídas Hoje">
                {completedTasks.length > 0 ? (
                     <ul className="space-y-4">
                        {completedTasks.map(task => (
                            <TaskItem key={task.id} task={task} onStart={handleStartTask} />
                        ))}
                    </ul>
                ) : (
                     <p className="text-center text-gray-400 dark:text-gray-500 py-4">Nenhuma tarefa concluída ainda.</p>
                )}
            </Card>
        </div>
    );
};

export default NurseDashboard;