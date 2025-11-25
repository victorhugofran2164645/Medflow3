

export enum UserRole {
    Admin = 'Administrador',
    Doctor = 'Médico',
    Nurse = 'Enfermeiro(a)',
    Pharmacist = 'Farmacêutico(a)',
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
}

export interface Medication {
    id: string;
    name: string;
    manufacturer: string;
    dosage: string;
    form: 'Tablet' | 'Capsule' | 'Liquid' | 'Injection';
}

export interface MedicationStock extends Medication {
    stockId: string;
    lotNumber: string;
    expiryDate: string;
    quantity: number;
}

export interface AdministrationRecord {
    id: string;
    medication: string;
    dosage: string;
    administeredAt: string;
    administeredBy: string;
    notes?: string;
}

export interface Patient {
    id: string;
    name: string;
    room: string;
    allergies: string[];
    prescriptions?: Prescription[];
    administrationHistory?: AdministrationRecord[];
}

export enum PrescriptionStatus {
    Pending = 'Pendente',
    Dispensed = 'Dispensado',
    Administered = 'Administrado',
    Cancelled = 'Cancelado'
}

export interface Prescription {
    id: string;
    patientId: string;
    medicationId: string;
    dosage: string;
    instructions: string;
    prescribedById: string; // Doctor's ID
    prescribedAt: string;
    status: PrescriptionStatus;
}

export interface AdministrationLog {
    id: string;
    prescriptionId: string;
    patientId: string;
    administeredById: string; // Nurse's ID
    administeredAt: string;
    notes?: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    userRole: UserRole;
    action: string;
    details: string;
}

export interface Task {
    id: string;
    patientId: string;
    patientName: string;
    room: string;
    medication: string;
    dosage: string;
    instructions: string;
    time: string;
    overdue?: boolean;
    completedAt?: string;
}

export type StockFilter = 'all' | 'low_stock' | 'expiring_soon';