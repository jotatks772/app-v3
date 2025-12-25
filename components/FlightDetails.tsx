
// This file is now repurposed as FlightDetailsModal.tsx
import React from 'react';
import type { Flight } from '../types';
import { AirlineLogo, ArrowRightIcon, BagIcon, CloseIcon, InfoIcon, UserIcon, WarningIcon } from './icons/Icons';

interface FlightDetailsModalProps {
  flight: Flight;
  onClose: () => void;
  onProceedToPayment: () => void;
}

const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({ flight, onClose, onProceedToPayment }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" aria-modal="true" role="dialog">
      <div className="bg-gray-100 w-full max-w-2xl h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white border-b">
          <h2 className="font-bold text-lg">{flight.departure.airportCode} - {flight.arrival.airportCode}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {/* Itinerary */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold mb-4">Itinerário</h3>
                {[
                    { type: 'Partida', date: '26 dez', flight },
                    { type: 'Ida e volta', date: '1 jan', flight } // Simulating return
                ].map(item => (
                    <div key={item.type} className="flex items-start gap-4 py-3">
                        <AirlineLogo airline={item.flight.airline} className="w-6 h-6 mt-1" />
                        <div className="flex-grow">
                            <p className="font-semibold">{item.type} &bull; <span className="font-normal text-gray-600">{item.date}</span></p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span>{item.flight.departure.time} - {item.flight.arrival.time}</span>
                                <span className="text-gray-300">&bull;</span>
                                <span>{item.flight.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Combined Tickets Info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex gap-3">
                <InfoIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-semibold">Combinação de bilhetes só de ida</h4>
                    <p className="text-sm text-gray-700 mt-1">Esta combinação de bilhetes pode ser mais barata. As condições de cada bilhete são independentes.</p>
                </div>
            </div>
            
            {/* Baggage */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                 <h3 className="font-bold mb-4">Bagagem</h3>
                 <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-md">
                    <span>Bagagem por pessoa</span>
                    <div className="flex items-center gap-2">
                        <BagIcon className="w-5 h-5"/> 1 <UserIcon className="w-5 h-5"/>
                    </div>
                 </div>
                 <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold text-green-600">&#10003; Incluído</span>: 1x Item pessoal</p>
                    <p>É possível adicionar no passo seguinte:</p>
                    <ul className="list-disc list-inside ml-4 text-gray-600">
                        <li>Bagagem de mão (55x40x20) - 10kg</li>
                        <li>Bagagem de porão</li>
                    </ul>
                 </div>
            </div>

            {/* Reservation Info */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg flex gap-3">
                <WarningIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-semibold">Reservar voo(s) {flight.airline}</h4>
                    <p className="text-sm text-gray-700 mt-1">Assim que o pagamento estiver concluído, confirme os seus voos e serviços com a {flight.airline}.</p>
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-white border-t flex justify-between items-center">
            <div>
                <p className="font-bold text-xl">{flight.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p className="text-xs text-gray-500">Preço por adulto</p>
            </div>
            <button onClick={onProceedToPayment} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors">
              Selecionar
            </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsModal;
