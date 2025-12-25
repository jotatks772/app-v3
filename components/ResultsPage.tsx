
import React from 'react';
import { Flight, SearchCriteria } from '../types';
import FlightList from './FlightList';

interface ResultsPageProps {
  flights: Flight[];
  criteria: SearchCriteria | null;
  onSelectFlight: (flight: Flight) => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ flights, criteria, onSelectFlight }) => {
  return (
    <FlightList flights={flights} criteria={criteria} onSelectFlight={onSelectFlight} />
  );
};

export default ResultsPage;
