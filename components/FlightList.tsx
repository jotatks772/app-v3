
// This file now represents the entire Results Page experience.
// It is kept as FlightList.tsx to avoid file system changes.

import React, { useMemo } from 'react';
import type { Flight, SearchCriteria } from '../types';
import { AirlineLogo, ArrowRightIcon } from './icons/Icons';

interface ResultsPageProps {
  flights: Flight[];
  criteria: SearchCriteria | null;
  onSelectFlight: (flight: Flight) => void;
}

const FlightCard: React.FC<{ flight: Flight; criteria: SearchCriteria | null; onSelect: (flight: Flight) => void }> = ({ flight, criteria, onSelect }) => {
  
  const renderItinerary = (direction: 'Partida' | 'Ida e volta') => (
    <div className="flex items-center gap-4">
        <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500">{direction} &bull; {criteria?.departureDate}</p>
            <div className="flex items-center justify-between mt-1">
                <div className="text-left">
                    <p className="font-bold text-lg text-gray-800">{flight.departure.time}</p>
                    <p className="text-sm text-gray-600">{flight.departure.airportCode}</p>
                </div>
                 <div className="flex flex-col items-center text-xs text-gray-500 w-24">
                    <span>{flight.duration}</span>
                    <div className="w-full border-t border-gray-300 my-1"></div>
                    <span>{flight.stops === 0 ? 'Voo Direto' : `${flight.stops} parada`}</span>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">{flight.arrival.time}</p>
                    <p className="text-sm text-gray-600">{flight.arrival.airportCode}</p>
                </div>
            </div>
        </div>
        <AirlineLogo airline={flight.airline} className="w-8 h-8"/>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg flex flex-col md:flex-row justify-between items-stretch gap-4 hover:shadow-lg transition-shadow">
        <div className="p-4 flex-grow space-y-4">
            {renderItinerary('Partida')}
            <div className="border-t border-dashed"></div>
            {/* Simulating return flight with same data for simplicity */}
            {renderItinerary('Ida e volta')}
        </div>
        <div className="bg-gray-50 border-t md:border-t-0 md:border-l p-4 flex md:flex-col justify-between items-center w-full md:w-48">
            <div className="text-center md:text-right">
                <p className="text-2xl font-bold text-gray-800">{flight.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p className="text-xs text-gray-500">Preço por adulto</p>
            </div>
            <button onClick={() => onSelect(flight)} className="mt-2 w-auto bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors">
                Ver viagem
            </button>
        </div>
    </div>
  );
};

const FlightFilters: React.FC<{ airlines: string[] }> = ({ airlines }) => (
    <div className="w-full lg:w-1/4 xl:w-1/5 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold mb-3">Número de escalas</h3>
            <div className="space-y-2 text-sm">
                {['Voo direto', 'Máximo uma escala', 'Tudo'].map((label, index) => (
                    <div key={label} className="flex items-center">
                        <input type="radio" id={`stops-${index}`} name="stops" defaultChecked={index === 2} className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500" />
                        <label htmlFor={`stops-${index}`} className="ml-2 text-gray-700">{label}</label>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold mb-3">Companhias aéreas</h3>
            <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                 {airlines.map((airline) => (
                    <div key={airline} className="flex items-center">
                        <input type="checkbox" id={`airline-${airline}`} name="airline" className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                        <label htmlFor={`airline-${airline}`} className="ml-2 text-gray-700">{airline}</label>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


const FlightList: React.FC<ResultsPageProps> = ({ flights, criteria, onSelectFlight }) => {
  const uniqueAirlines = useMemo(() => Array.from(new Set(flights.map(f => f.airline))), [flights]);
  
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <FlightFilters airlines={uniqueAirlines} />
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">A mostrar {flights.length} de {flights.length} voos</p>
              {/* Sorting options can be added here */}
          </div>
          {flights.length > 0 ? (
            <div className="space-y-4">
              {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} criteria={criteria} onSelect={onSelectFlight} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-600">Nenhum voo encontrado para os critérios selecionados.</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default FlightList;
