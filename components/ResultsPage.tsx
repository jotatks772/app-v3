import React from 'react';
import { FlightItinerary, SearchCriteria } from '../types';
import FlightList from './FlightList';

interface ResultsPageProps {
  itineraries: FlightItinerary[];
  criteria: SearchCriteria | null;
  onSelectItinerary: (itinerary: FlightItinerary) => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ itineraries, criteria, onSelectItinerary }) => {
  return (
    <FlightList itineraries={itineraries} criteria={criteria} onSelectItinerary={onSelectItinerary} />
  );
};

export default ResultsPage;```
---
#### **Ficheiro Modificado: `C:\Users\scjot\Documents\Google DW\app-v3-main\app-v3-main\components\FlightList.tsx`**
> O coração da nova interface. Completamente reconstruído para apresentar os cards de itinerário, filtros e ordenação.

```tsx
import React, { useMemo, useState } from 'react';
import type { Flight, FlightItinerary, SearchCriteria } from '../types';
import { AirlineLogo } from './icons/Icons';

type SortOption = 'quality' | 'price' | 'duration';

interface ResultsPageProps {
  itineraries: FlightItinerary[];
  criteria: SearchCriteria | null;
  onSelectItinerary: (itinerary: FlightItinerary) => void;
}

const ItineraryCard: React.FC<{ itinerary: FlightItinerary; onSelect: (itinerary: FlightItinerary) => void }> = ({ itinerary, onSelect }) => {
  
  const FlightLeg: React.FC<{ leg: Flight, type: 'Partida' | 'Ida e volta' }> = ({ leg, type }) => (
    <div className="flex items-center gap-4">
        <div className="w-1/4">
            <p className="font-semibold text-gray-800">{type}</p>
            <p className="text-xs text-gray-500">26 dez - Económica</p>
        </div>
        <div className="flex-grow flex items-center">
            <div className="text-right">
                <p className="font-bold text-lg text-gray-800">{leg.departure.time}</p>
                <p className="text-sm text-gray-600">{leg.departure.airportCode}</p>
            </div>
            <div className="flex-1 px-4">
                <div className="w-full border-t border-gray-300 relative">
                    <div className="absolute -top-1 left-0 w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="absolute -top-1 right-0 w-2 h-2 bg-gray-400 rounded-full"></div>
                    <p className="text-center text-xs text-gray-500 py-1">{leg.duration}</p>
                </div>
                <p className="text-center text-xs text-gray-500">{leg.stops === 0 ? 'Voo Direto' : `${leg.stops} parada(s)`}</p>
            </div>
             <div className="text-left">
                <p className="font-bold text-lg text-gray-800">{leg.arrival.time}</p>
                <p className="text-sm text-gray-600">{leg.arrival.airportCode}</p>
            </div>
        </div>
        <AirlineLogo airline={leg.airline} className="w-8 h-8 ml-4"/>
    </div>
  );

  return (
    <div className="bg-white border border-theme-border rounded-lg flex flex-col md:flex-row justify-between items-stretch gap-0 hover:shadow-lg transition-shadow">
        <div className="p-4 flex-grow space-y-4">
            <FlightLeg leg={itinerary.outbound} type="Partida" />
            <div className="border-t border-dashed my-2"></div>
            <FlightLeg leg={itinerary.inbound} type="Ida e volta" />
        </div>
        <div className="bg-gray-50 border-t md:border-t-0 md:border-l p-4 flex md:flex-col justify-between items-center w-full md:w-48">
            <div className="text-center md:text-right">
                <p className="text-2xl font-bold text-theme-text">{itinerary.totalPrice.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
                <p className="text-xs text-theme-text-secondary">Preço por adulto</p>
            </div>
            <button onClick={() => onSelect(itinerary)} className="mt-2 w-full bg-theme-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-theme-primary-hover transition-colors">
                Ver viagem
            </button>
        </div>
    </div>
  );
};

const FlightFilters: React.FC<{ itineraries: FlightItinerary[] }> = ({ itineraries }) => {
    const uniqueAirlines = useMemo(() => Array.from(new Set(itineraries.flatMap(i => [i.outbound.airline, i.inbound.airline]))), [itineraries]);

    const FilterSection: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold mb-3 text-theme-text">{title}</h3>
            {children}
        </div>
    );

    return (
    <div className="w-full lg:w-1/4 xl:w-1/5 space-y-6">
        <FilterSection title="Número de escalas">
            <div className="space-y-2 text-sm">
                {['Voo direto', 'Máximo uma escala', 'Tudo'].map((label, index) => (
                    <div key={label} className="flex items-center">
                        <input type="radio" id={`stops-${index}`} name="stops" defaultChecked={index === 2} className="h-4 w-4 text-theme-primary border-gray-300 focus:ring-theme-primary" />
                        <label htmlFor={`stops-${index}`} className="ml-2 text-theme-text-secondary">{label}</label>
                    </div>
                ))}
            </div>
        </FilterSection>
        <FilterSection title="Companhias aéreas">
            <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                 {uniqueAirlines.map((airline) => (
                    <div key={airline} className="flex items-center">
                        <input type="checkbox" id={`airline-${airline}`} name="airline" className="h-4 w-4 text-theme-primary border-gray-300 rounded focus:ring-theme-primary" />
                        <label htmlFor={`airline-${airline}`} className="ml-2 text-theme-text-secondary">{airline}</label>
                    </div>
                ))}
            </div>
        </FilterSection>
        <FilterSection title="Horários">
            <p className="text-xs text-theme-text-secondary">Sliders de horário a implementar.</p>
        </FilterSection>
    </div>
    );
}

const FlightList: React.FC<ResultsPageProps> = ({ itineraries, criteria, onSelectItinerary }) => {
    const [sort, setSort] = useState<SortOption>('quality');

    const sortedItineraries = useMemo(() => {
        const sorted = [...itineraries];
        switch (sort) {
            case 'price':
                return sorted.sort((a, b) => a.totalPrice - b.totalPrice);
            case 'duration':
                // Lógica de duração simplificada. Uma real precisaria converter 'Xh Ym' para minutos.
                return sorted.sort((a, b) => a.totalDuration.localeCompare(b.totalDuration));
            case 'quality':
            default:
                 // "Relação preço/qualidade" - uma métrica complexa. Por agora, ordenamos por preço e escalas.
                return sorted.sort((a, b) => (a.totalPrice * (a.outbound.stops + a.inbound.stops + 1)) - (b.totalPrice * (b.outbound.stops + b.inbound.stops + 1)));
        }
    }, [itineraries, sort]);

    const SortButton: React.FC<{label: string, value: SortOption}> = ({label, value}) => (
        <button 
        onClick={() => setSort(value)}
        className={`px-4 py-2 text-sm rounded-md ${sort === value ? 'bg-theme-primary text-white font-semibold' : 'bg-white text-theme-text-secondary hover:bg-gray-100'}`}
        >{label}</button>
    );
  
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <FlightFilters itineraries={itineraries} />
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-4 p-2 bg-white rounded-lg shadow-sm">
              <SortButton label="Relação preço/qualidade" value="quality" />
              <SortButton label="O mais barato" value="price" />
              <SortButton label="Tempo de voo mais curto" value="duration" />
          </div>
          {sortedItineraries.length > 0 ? (
            <div className="space-y-4">
              {sortedItineraries.map((itinerary) => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} onSelect={onSelectItinerary} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-theme-text-secondary">Nenhum voo encontrado para os critérios selecionados.</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default FlightList;
