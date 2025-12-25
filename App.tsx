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
        setCurrentView(View.PAYMENT);
        setSelectedItinerary(null);
    }
  }, [selectedItinerary]);

  const handlePayment = useCallback((_paymentDetails: PaymentFormData) => {
    console.log('Informações do Passageiro e Pagamento:', paymentData);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentView(View.CONFIRMATION);
    }, 2000);
  }, [paymentData]);

  const handleGoBack = useCallback(() => {
    switch (currentView) {
      case View.FLIGHTS:
      case View.ADMIN_PANEL:
        setCurrentView(View.SEARCH);
        setItineraries([]);
        setSearchCriteria(null);
        break;
      case View.PAYMENT:
        setCurrentView(View.FLIGHTS);
        break;
      default:
        setCurrentView(View.SEARCH);
    }
  }, [currentView]);
  
    const handleGoToSearch = useCallback(() => {
        setCurrentView(View.SEARCH);
        setItineraries([]);
        setSearchCriteria(null);
        setSelectedItinerary(null);
        setError(null);
    }, []);

  const handleStartOver = useCallback(() => {
    setCurrentView(View.SEARCH);
    setSearchCriteria(null);
    setItineraries([]);
    setSelectedItinerary(null);
    setError(null);
    setPaymentData({
      passenger: { fullName: '', email: '' },
      payment: { cardNumber: '', expiryDate: '', cvv: '', cardHolder: '' },
    });
  }, []);

  const handleAdminLoginSuccess = () => {
    setCurrentView(View.ADMIN_PANEL);
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;

    if (error) {
      return (
        <div className="text-center p-8 container mx-auto">
          <p className="text-red-500">{error}</p>
          <button
            onClick={handleStartOver}
            className="mt-4 px-6 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-hover transition-colors"
          >
            Nova Busca
          </button>
        </div>
      );
    }

    switch (currentView) {
      case View.SEARCH:
        return <SearchPage onSearch={handleSearch} />;
      case View.FLIGHTS:
        return <ResultsPage itineraries={itineraries} criteria={searchCriteria} onSelectItinerary={handleSelectItinerary} />;
      case View.PAYMENT:
        return <div className="container mx-auto p-4 sm:p-6 md:p-8"><PaymentForm paymentData={paymentData} onPaymentDataChange={setPaymentData} onPay={handlePayment} onGoBack={handleGoBack} /></div>;
      case View.CONFIRMATION:
        if (!searchCriteria) return null;
        return <div className="container mx-auto p-4 sm:p-6 md:p-8"><Confirmation criteria={searchCriteria} onStartOver={handleStartOver} /></div>;
      case View.ADMIN_LOGIN:
        return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      case View.ADMIN_PANEL:
        return <AdminPanel paymentData={paymentData} onGoBack={handleGoBack} />;
      default:
        return <SearchPage onSearch={handleSearch} />;
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg-light flex flex-col">
      <Header currentView={currentView} criteria={searchCriteria} onLogoClick={handleGoToSearch} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      {selectedItinerary && (
        <FlightDetailsModal
          itinerary={selectedItinerary}
          onClose={handleCloseModal}
          onProceedToPayment={handleProceedToPayment}
        />
      )}
      <Footer onAdminClick={() => setCurrentView(View.ADMIN_LOGIN)} />
    </div>
  );
};

export default App;
