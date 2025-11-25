
import React from 'react';
import { MedicationStock, AuditLog, UserRole, Patient, Task, Prescription, AdministrationRecord, PrescriptionStatus } from './types';

export const ICONS = {
    moon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
    sun: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    home: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    pills: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    users: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.978 5.978 0 0112 13a5.979 5.979 0 012.121.303m-2.121-.303c2.423.832 4.285 3.14 4.285 5.942M3 21a5.978 5.978 0 012.121-4.898" /></svg>,
    history: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    box: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    alertTriangle: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    plus: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
    check: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    edit: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l12.232-12.232z" /></svg>,
    trash: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    download: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
};


export const mockMedicationStock: MedicationStock[] = [
  { id: 'med001', stockId: 'stk001', name: 'Paracetamol', manufacturer: 'PharmaCo', dosage: '500mg', form: 'Tablet', lotNumber: 'A123', expiryDate: '2025-12-31', quantity: 1500 },
  { id: 'med002', stockId: 'stk002', name: 'Ibuprofeno', manufacturer: 'HealthInc', dosage: '200mg', form: 'Tablet', lotNumber: 'B456', expiryDate: '2024-08-31', quantity: 250 },
  { id: 'med003', stockId: 'stk003', name: 'Amoxicilina', manufacturer: 'MediProd', dosage: '250mg/5ml', form: 'Liquid', lotNumber: 'C789', expiryDate: '2024-07-20', quantity: 80 },
  { id: 'med004', stockId: 'stk004', name: 'Dipirona', manufacturer: 'PharmaCo', dosage: '1g', form: 'Injection', lotNumber: 'D012', expiryDate: '2026-01-15', quantity: 500 },
  { id: 'med005', stockId: 'stk005', name: 'Loratadina', manufacturer: 'HealthInc', dosage: '10mg', form: 'Capsule', lotNumber: 'E345', expiryDate: '2023-10-01', quantity: 0 },
  { id: 'med006', stockId: 'stk006', name: 'Aspirina', manufacturer: 'PharmaCo', dosage: '100mg', form: 'Tablet', lotNumber: 'F678', expiryDate: '2025-05-30', quantity: 800 },
];

export const mockRecentActivity: AuditLog[] = [
    { id: 'log001', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), userId: 'nurse01', userName: 'RN. Sarah Chen', userRole: UserRole.Nurse, action: 'Medicação Administrada', details: 'Administrou Paracetamol 500mg para John Doe' },
    { id: 'log002', timestamp: new Date(Date.now() - 33 * 60000).toISOString(), userId: 'pharm01', userName: 'RPh. Michael Lee', userRole: UserRole.Pharmacist, action: 'Medicação Dispensada', details: 'Dispensou a prescrição #presc001 para John Doe' },
    { id: 'log003', timestamp: new Date(Date.now() - 64 * 60000).toISOString(), userId: 'doc01', userName: 'Dr. James Carter', userRole: UserRole.Doctor, action: 'Medicação Prescrita', details: 'Prescreveu Paracetamol 500mg para John Doe' },
    { id: 'log004', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), userId: 'admin01', userName: 'Dr. Evelyn Reed', userRole: UserRole.Admin, action: 'Login de Utilizador', details: 'Utilizador admin01 iniciou sessão com sucesso.' },
];

const mockPrescriptionsForJohn: Prescription[] = [
    { id: 'presc001', patientId: 'p001', medicationId: 'Paracetamol', dosage: '500mg', instructions: 'A cada 6 horas, se houver dor.', prescribedById: 'doc01', prescribedAt: '2023-10-27T09:00:00Z', status: PrescriptionStatus.Administered },
    { id: 'presc002', patientId: 'p001', medicationId: 'Ibuprofeno', dosage: '200mg', instructions: 'A cada 8 horas, por 3 dias.', prescribedById: 'doc01', prescribedAt: '2023-10-27T11:00:00Z', status: PrescriptionStatus.Dispensed },
];

const mockAdminHistoryForJohn: AdministrationRecord[] = [
    { id: 'admin001', medication: 'Paracetamol 500mg', dosage: '1 comprimido', administeredAt: '2023-10-27T10:05:00Z', administeredBy: 'RN. Sarah Chen', notes: 'Paciente relatou alívio da dor.' },
    { id: 'admin002', medication: 'Ibuprofeno 200mg', dosage: '1 comprimido', administeredAt: '2023-10-27T11:30:00Z', administeredBy: 'Sistema', notes: 'Prescrição dispensada pela farmácia.' },
    { id: 'admin003', medication: 'Paracetamol 500mg', dosage: '1 comprimido', administeredAt: '2023-10-27T09:00:00Z', administeredBy: 'Sistema', notes: 'Prescrição criada. Aguardando administração.' },
];


export const mockPatients: Patient[] = [
    { id: 'p001', name: 'John Doe', room: '101A', allergies: ['Penicilina', 'Aspirina'], prescriptions: mockPrescriptionsForJohn, administrationHistory: mockAdminHistoryForJohn },
    { id: 'p002', name: 'Jane Smith', room: '102B', allergies: [], prescriptions: [ { id: 'presc003', patientId: 'p002', medicationId: 'Dipirona', dosage: '1g', instructions: 'Dose única.', prescribedById: 'doc01', prescribedAt: '2023-10-27T14:00:00Z', status: PrescriptionStatus.Pending }], administrationHistory: [] },
    { id: 'p003', name: 'Peter Jones', room: '103A', allergies: ['Látex'], prescriptions: [], administrationHistory: [] },
    { id: 'p004', name: 'Mary Johnson', room: '201C', allergies: ['Nozes', 'Ibuprofeno'], prescriptions: [], administrationHistory: [] },
];

export const mockTasks: Task[] = [
  { id: 'task001', patientId: 'p002', patientName: 'Jane Smith', room: '102B', medication: 'Dipirona', dosage: '1g', instructions: 'Dose única.', time: '16:00', overdue: true },
  { id: 'task002', patientId: 'p001', patientName: 'John Doe', room: '101A', medication: 'Ibuprofeno', dosage: '200mg', instructions: 'A cada 8 horas, por 3 dias.', time: '19:00' },
  { id: 'task003', patientId: 'p001', patientName: 'John Doe', room: '101A', medication: 'Paracetamol', dosage: '500mg', instructions: 'A cada 6 horas, se houver dor.', time: '16:00', completedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
];