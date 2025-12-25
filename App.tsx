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
        // A fase "Dados do Viajante" e "Pagamento" estão combinadas neste componente
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

export default App;```
---
#### **Ficheiro Modificado: `C:\Users\scjot\Documents\Google DW\app-v3-main\app-v3-main\components\Header.tsx`**
> O cabeçalho foi redesenhado para a página de resultados, conforme a referência.

```tsx
import React from 'react';
import { View, SearchCriteria } from '../types';
import { GlobeIcon, HelpCircleIcon, UserIcon, CalendarIcon, UsersIcon } from './icons/Icons';

interface HeaderProps {
    currentView: View;
    criteria: SearchCriteria | null;
    onLogoClick: () => void;
}

const UtilityButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-theme-text-secondary hover:bg-gray-100 rounded-md">
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ currentView, criteria, onLogoClick }) => {
  const isResultsView = currentView === View.FLIGHTS && criteria;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-6">
                    <button onClick={onLogoClick} className="text-2xl font-bold text-theme-primary">mytrip</button>
                    {isResultsView && (
                         <div className="hidden lg:flex items-center gap-4 h-14 text-sm bg-white p-2 rounded-md border border-theme-border">
                            <span className="font-semibold text-theme-text">{criteria.origin} &harr; {criteria.destination}</span>
                            <div className="flex items-center gap-2 text-theme-text-secondary border-l pl-4">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{criteria.departureDate} - {criteria.returnDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-theme-text-secondary border-l pl-4">
                                <UsersIcon className="w-4 h-4" />
                                <span>{criteria.passengers}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2">
                        <UtilityButton>
                            <GlobeIcon className="w-5 h-5" />
                            <span>Português</span>
                        </UtilityButton>
                        <UtilityButton>
                            <HelpCircleIcon className="w-5 h-5" />
                            <span>Assistência</span>
                        </UtilityButton>
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;
