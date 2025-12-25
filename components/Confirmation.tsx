
import React from 'react';
import type { SearchCriteria } from '../types';

interface ConfirmationProps {
  criteria: SearchCriteria;
  onStartOver: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ criteria, onStartOver }) => {
  return (
    <div className="p-6 sm:p-8 text-center bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Reserva Confirmada!</h2>
      <p className="text-gray-600 mt-2">Sua viagem para {criteria.destination} está garantida. Obrigado por voar com a My-Triip!</p>

      <div className="mt-8 text-left border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h3 className="font-bold text-gray-700 mb-4">Resumo da sua viagem</h3>
        <div className="space-y-3 text-sm">
            <p><span className="font-semibold">Rota:</span> {criteria.origin} &rarr; {criteria.destination}</p>
            <p><span className="font-semibold">Datas:</span> {criteria.departureDate} a {criteria.returnDate}</p>
            <p><span className="font-semibold">Passageiros:</span> {criteria.passengers}</p>
        </div>
        <p className="mt-4 text-xs text-gray-500">Um e-mail de confirmação com todos os detalhes foi enviado para você.</p>
      </div>

      <div className="mt-8">
        <button
          onClick={onStartOver}
          className="bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition"
        >
          Fazer Nova Reserva
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
