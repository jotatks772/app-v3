// This file now represents the entire Search Page experience, not just a form.
// It is kept as SearchForm.tsx to avoid file system changes.

import React, { useState, useRef, useEffect } from 'react';
import { SearchCriteria, FlightClass } from '../types';
import { ArrowRightLeftIcon, CalendarIcon, ChevronDownIcon, UsersIcon, XIcon, PlaneTakeoffIcon } from './icons/Icons';

interface SearchPageProps {
  onSearch: (criteria: SearchCriteria) => void;
}

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (val: string) => void; placeholder: string; }> = ({ label, id, value, onChange, placeholder }) => (
  <div className="relative flex-1">
    <label htmlFor={id} className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500">{label}</label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="w-full h-14 pl-4 pr-10 pt-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-900"
    />
    {value && <button type="button" onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><XIcon className="w-5 h-5" /></button>}
  </div>
);

const SearchForm: React.FC<SearchPageProps> = ({ onSearch }) => {
  const [origin, setOrigin] = useState('Porto');
  const [destination, setDestination] = useState('Madrid');
  const [departureDate, setDepartureDate] = useState('2025-12-26');
  const [returnDate, setReturnDate] = useState('2026-01-01');
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('round-trip');
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState<FlightClass>(FlightClass.ECONOMY);
  const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
  const [isPassengerPopoverOpen, setIsPassengerPopoverOpen] = useState(false);
  const passengerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (passengerRef.current && !passengerRef.current.contains(event.target as Node)) {
        setIsPassengerPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [passengerRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination && departureDate && (tripType === 'one-way' || returnDate) && passengers > 0) {
      onSearch({ origin, destination, departureDate, returnDate: tripType === 'one-way' ? undefined : returnDate, passengers, flightClass, directFlightsOnly, tripType });
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg">
      <div className="flex items-center border-b mb-4">
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={`px-4 py-2 text-sm font-semibold ${tripType === 'round-trip' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Ida e volta
        </button>
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          className={`px-4 py-2 text-sm font-semibold ${tripType === 'one-way' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Viagem só de ida
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-2">
          <InputField label="De" id="origin" value={origin} onChange={setOrigin} placeholder="Cidade ou aeroporto" />
          <button type="button" className="p-2 self-center border rounded-full text-gray-500 hover:bg-gray-100 mx-2">
            <ArrowRightLeftIcon className="w-5 h-5" />
          </button>
          <InputField label="Para" id="destination" value={destination} onChange={setDestination} placeholder="Cidade ou aeroporto" />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${tripType === 'one-way' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-2`}>
          <div className="relative">
            <label htmlFor="departureDate" className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500">Partida</label>
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input type="date" id="departureDate" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required className="w-full h-14 pl-10 pr-3 pt-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-900" />
          </div>
          {tripType !== 'one-way' && (
            <div className="relative">
              <label htmlFor="returnDate" className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500">Volta</label>
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input type="date" id="returnDate" value={returnDate} onChange={e => setReturnDate(e.target.value)} required={tripType !== 'one-way'} className="w-full h-14 pl-10 pr-3 pt-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-gray-900" />
            </div>
          )}

          {/* Passengers & Class */}
          <div className="relative" ref={passengerRef}>
            <label className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500">Passageiros</label>
            <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <button
                type="button"
                onClick={() => setIsPassengerPopoverOpen(!isPassengerPopoverOpen)}
                className="w-full h-14 pl-10 pr-3 pt-2 border border-gray-300 rounded-md bg-white cursor-pointer text-gray-900 text-left"
            >
                {`${passengers} ${passengers > 1 ? 'adultos' : 'adulto'}`}
            </button>
            {isPassengerPopoverOpen && (
                <div className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-20 p-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">Adultos</span>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setPassengers(p => Math.max(1, p - 1))}
                                disabled={passengers <= 1}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-lg text-teal-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                -
                            </button>
                            <span className="text-lg font-semibold w-8 text-center">{passengers}</span>
                            <button
                                type="button"
                                onClick={() => setPassengers(p => Math.min(9, p + 1))}
                                disabled={passengers >= 9}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-lg text-teal-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                +
                            </button>
                        </div>
                    </div>
                     <div className="text-right mt-4">
                        <button
                            type="button"
                            onClick={() => setIsPassengerPopoverOpen(false)}
                            className="px-4 py-1.5 bg-teal-600 text-white text-sm font-semibold rounded-md hover:bg-teal-700"
                        >
                            Concluído
                        </button>
                    </div>
                </div>
            )}
          </div>
          <div className="relative">
            <label className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500">Classe</label>
            <select value={flightClass} onChange={e => setFlightClass(e.target.value as FlightClass)} className="w-full h-14 pl-3 pr-8 pt-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white text-gray-900">
              {Object.values(FlightClass).map(fc => <option key={fc} value={fc}>{fc}</option>)}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-2">
          <div className="flex items-center">
            <input
              id="directFlightsOnly"
              type="checkbox"
              checked={directFlightsOnly}
              onChange={(e) => setDirectFlightsOnly(e.target.checked)}
              className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="directFlightsOnly" className="ml-2 block text-sm text-gray-700">
              Apenas voos diretos
            </label>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <PlaneTakeoffIcon className="h-5 w-5" />
            Pesquisar voos
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
