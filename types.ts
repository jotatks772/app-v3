
export enum View {
  SEARCH = 'SEARCH',
  FLIGHTS = 'FLIGHTS',
  DETAILS = 'DETAILS', // Mantido para possível uso futuro, embora agora seja um modal
  PAYMENT = 'PAYMENT',
  CONFIRMATION = 'CONFIRMATION',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_PANEL = 'ADMIN_PANEL',
}

export enum FlightClass {
  ECONOMY = 'Económica',
  PREMIUM_ECONOMY = 'Económica Premium',
  BUSINESS = 'Executiva',
  FIRST = 'Primeira Classe',
}

export interface SearchCriteria {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'round-trip' | 'one-way' | 'multi-city';
  passengers: number;
  flightClass: FlightClass;
  directFlightsOnly: boolean;
}

export interface FlightTime {
  time: string;
  airport: string;
  airportCode: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: FlightTime;
  arrival: FlightTime;
  duration: string;
  stops: number;
  price: number;
}

export interface PassengerInfo {
  fullName: string;
  email: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
}

export interface PaymentFormData {
  passenger: PassengerInfo;
  payment: PaymentInfo;
}
