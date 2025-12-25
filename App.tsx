import React, { useState, useCallback } from 'react';
import { View, SearchCriteria, FlightItinerary, PaymentFormData } from './types';
import { findFlights } from './services/flightService';

import Header from './components/Header';
import SearchPage from './components/SearchPage';
import ResultsPage from './components/ResultsPage';
import FlightDetailsModal from './components/FlightDetailsModal';
import PaymentForm from './components/PaymentForm';
import Confirmation from './components/Confirmation';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.SEARCH);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [itineraries, setItineraries] = useState<FlightItinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<FlightItinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    passenger: { fullName: '', email: '' },
    payment: { cardNumber: '', expiryDate: '', cvv: '', cardHolder: '' },
  });

  const handleSearch = useCallback(async (criteria: SearchCriteria) => {
    setIsLoading(true);
    setError(null);
    setSearchCriteria(criteria);
    try {
      const results = await findFlights(criteria);
      setItineraries(results);
      setCurrentView(View.FLIGHTS);
    } catch (err) {
      setError('Falha ao buscar voos. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectItinerary = useCallback((itinerary: FlightItinerary) => {
    setSelectedItinerary(itinerary);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedItinerary(null);
  }, []);

  const handleProceedToPayment = useCallback(() => {
    if (selectedItinerary) {
        // Lógica para transitar para a página de dados do viajante/pagamento
        setCurrentView(View.PAYMENT);
        setSelectedItinerary(null); // Fecha o modal
    }
  }, [selectedItinerary]);

  const handlePayment = useCallback((_paymentDetails: PaymentFormData) => {
    console.log('Informações do Passageiro e Pagamento:', paymentData);
    setIsLoading(true);
