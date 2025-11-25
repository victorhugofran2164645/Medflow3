import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Header from '../components/shared/Header';
import BottomNav from '../components/shared/BottomNav';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import DoctorDashboard from '../components/dashboards/DoctorDashboard';
import NurseDashboard from '../components/dashboards/NurseDashboard';
import PharmacistDashboard from '../components/dashboards/PharmacistDashboard';
import { UserRole, StockFilter, Patient } from '../types';
import MedicationStock from '../components/shared/MedicationStock';
import PatientList from '../components/shared/PatientList';
import AuditTrail from '../components/shared/AuditTrail';
import UserManagement from '../components/admin/UserManagement';
import PatientProfile from '../components/doctor/PatientProfile';
import NursePatientDetailView from '../components/nurse/PatientDetailView';
import AdminPatientDetailView from '../components/admin/AdminPatientDetailView';

const MainLayout: React.FC = () => {
    const { currentUser } = useAppContext();
    const [activeTab, setActiveTab] = useState('home');
    const [stockFilter, setStockFilter] = useState<StockFilter>('all');
    const [activePatient, setActivePatient] = useState<Patient | null>(null); // Para o painel do médico
    const [patientInView, setPatientInView] = useState<Patient | null>(null); // Para o separador de pacientes

     useEffect(() => {
        // Repõe as visualizações do paciente ao mudar os separadores principais para evitar visualizações obsoletas
        if (activeTab !== 'home') {
            setActivePatient(null);
        }
        if (activeTab !== 'patients') {
            setPatientInView(null);
        }
    }, [activeTab]);


    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return renderDashboard();
            case 'stock':
                return <MedicationStock stockFilter={stockFilter} setStockFilter={setStockFilter} />;
            case 'patients':
                if (patientInView) {
                    if (currentUser?.role === UserRole.Nurse) {
                        return <NursePatientDetailView patient={patientInView} onBack={() => setPatientInView(null)} />;
                    }
                     if (currentUser?.role === UserRole.Admin) {
                        return <AdminPatientDetailView patient={patientInView} onBack={() => setPatientInView(null)} />;
                    }
                }
                return <PatientList onSelectPatient={setPatientInView} />;
            case 'audit':
                return <AuditTrail />;
            case 'userManagement':
                if (currentUser?.role === UserRole.Admin) {
                    return <UserManagement setActiveTab={setActiveTab} />;
                }
                return renderDashboard(); // Fallback por segurança
            default:
                return renderDashboard();
        }
    };
    
    const renderDashboard = () => {
        if (!currentUser) return null;
        switch (currentUser.role) {
            case UserRole.Admin:
                return <AdminDashboard setActiveTab={setActiveTab} setStockFilter={setStockFilter} />;
            case UserRole.Doctor:
                if (activePatient) {
                    return <PatientProfile patient={activePatient} onBack={() => setActivePatient(null)} />;
                }
                return <DoctorDashboard onSelectPatient={setActivePatient} />;
            case UserRole.Nurse:
                return <NurseDashboard />;
            case UserRole.Pharmacist:
                return <PharmacistDashboard />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
          <div className="w-full max-w-4xl mx-auto flex flex-col h-full bg-white dark:bg-slate-900 shadow-2xl border-x border-gray-200 dark:border-slate-800">
              <Header />
              <main className="flex-1 overflow-y-auto pb-20 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {renderContent()}
              </main>
              <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
    );
};

export default MainLayout;