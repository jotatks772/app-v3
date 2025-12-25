
import { SearchCriteria, Flight, FlightClass } from "../types";

export const findFlights = async (criteria: SearchCriteria): Promise<Flight[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const mockFlights: Flight[] = [
    {
      id: "mock-1",
      airline: "TAP Air Portugal",
      flightNumber: "TP123",
      departure: {
        time: "08:00",
        airport: criteria.origin,
        airportCode: criteria.origin.substring(0, 3).toUpperCase()
      },
      arrival: {
        time: "10:30",
        airport: criteria.destination,
        airportCode: criteria.destination.substring(0, 3).toUpperCase()
      },
      duration: "2h 30m",
      stops: 0,
      price: 1500
    },
    {
      id: "mock-2",
      airline: "Ryanair",
      flightNumber: "FR456",
      departure: {
        time: "14:15",
        airport: criteria.origin,
        airportCode: criteria.origin.substring(0, 3).toUpperCase()
      },
      arrival: {
        time: "16:45",
        airport: criteria.destination,
        airportCode: criteria.destination.substring(0, 3).toUpperCase()
      },
      duration: "2h 30m",
      stops: 0,
      price: 850
    },
    {
      id: "mock-3",
      airline: "Iberia",
      flightNumber: "IB789",
      departure: {
        time: "18:00",
        airport: criteria.origin,
        airportCode: criteria.origin.substring(0, 3).toUpperCase()
      },
      arrival: {
        time: "21:30",
        airport: criteria.destination,
        airportCode: criteria.destination.substring(0, 3).toUpperCase()
      },
      duration: "3h 30m",
      stops: 1,
      price: 1200
    }
  ];

  return mockFlights;
};
