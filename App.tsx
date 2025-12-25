import React, { useState, useCallback, useEffect } from 'react';
import { View, SearchCriteria, Flight, PassengerInfo, PaymentFormData } from './types';
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
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    passenger: { fullName: '', email: '' },
    payment: { cardNumber: '', expiryDate: '', cvv: '', cardHolder: '' },
  });

  // Socket logic removed for Netlify migration. 
  // Real-time updates are now handled within the components via API calls (PaymentForm writes, AdminPanel polls).

  const handleSearch = useCallback(async (criteria: SearchCriteria) => {
    setIsLoading(true);
    setError(null);
    setSearchCriteria(criteria);
    try {
      const results = await findFlights(criteria);
      setFlights(results);
      setCurrentView(View.FLIGHTS);
    } catch (err) {
      setError('Falha ao buscar voos. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectFlight = useCallback((flight: Flight) => {
    setSelectedFlight(flight);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedFlight(null);
  }, []);

  const handleProceedToPayment = useCallback(() => {
    setSelectedFlight(null);
    setCurrentView(View.PAYMENT);
  }, []);

  // FIX: Changed parameter type from PassengerInfo to PaymentFormData to match the onPay prop of PaymentForm.
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
        setFlights([]);
        setSearchCriteria(null);
        break;
      case View.PAYMENT:
        setCurrentView(View.FLIGHTS);
        break;
      default:
        setCurrentView(View.SEARCH);
    }
  }, [currentView]);

  const handleStartOver = useCallback(() => {
    setCurrentView(View.SEARCH);
    setSearchCriteria(null);
    setFlights([]);
    setSelectedFlight(null);
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
            className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
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
        return <ResultsPage flights={flights} criteria={searchCriteria} onSelectFlight={handleSelectFlight} />;
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header currentView={currentView} criteria={searchCriteria} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      {selectedFlight && (
        <FlightDetailsModal
          flight={selectedFlight}
          onClose={handleCloseModal}
          onProceedToPayment={handleProceedToPayment}
        />
      )}
      <Footer onAdminClick={() => setCurrentView(View.ADMIN_LOGIN)} />
    </div>
  );
};

export default App;
