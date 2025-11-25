import React, { useEffect, useRef, useState } from 'react';
import { Task } from '../../types';

interface QRScannerProps {
    taskToVerify: Task | null;
    onScanSuccess: () => void;
    onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ taskToVerify, onScanSuccess, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!taskToVerify) {
            setError("Nenhuma tarefa selecionada para administração.");
            return;
        }

        let stream: MediaStream;

        const startCamera = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'environment' }
                    });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } else {
                    setError('O seu navegador não suporta acesso à câmara.');
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
                setError('Não foi possível aceder à câmara. Verifique as permissões.');
            }
        };

        startCamera();
        
        // Simula um scan bem-sucedido correspondente à tarefa após 3 segundos
        const scanTimeout = setTimeout(() => {
            // Aqui, na vida real, você decodificaria o QR e compararia com `taskToVerify.id`
            console.log(`Simulating successful scan for task: ${taskToVerify.id}`);
            onScanSuccess();
        }, 3000);

        return () => {
            clearTimeout(scanTimeout);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [taskToVerify, onScanSuccess]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center animate-fade-in p-4">
            <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover"></video>

            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center justify-center text-white w-full h-full text-center">
                <div className="bg-black/50 p-4 rounded-lg mb-4">
                    <p className="font-semibold">A verificar para: {taskToVerify?.patientName}</p>
                    <p className="text-lg text-primary-300">{taskToVerify?.medication} {taskToVerify?.dosage}</p>
                </div>

                <div className="w-64 h-64 border-4 border-dashed border-white rounded-lg relative overflow-hidden">
                    <div className="scanner-line absolute top-0 left-0 w-full h-1 bg-primary-400 shadow-[0_0_10px_theme(colors.primary.400)]"></div>
                </div>

                {error && <p className="mt-4 text-red-400 bg-red-900/50 p-2 rounded">{error}</p>}
                
                <button
                    onClick={onClose}
                    className="absolute bottom-10 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition"
                >
                    Cancelar
                </button>
            </div>
            <style>{`
                @keyframes scan {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(256px); }
                }
                .scanner-line {
                    animation: scan 2.5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default QRScanner;