import { SearchCriteria, Flight, FlightItinerary } from "../types";

const generateRandomFlight = (id: number, criteria: SearchCriteria, isOutbound: boolean): Flight => {
    const airlines = ["TAP Air Portugal", "Ryanair", "Iberia", "Air Europa", "EasyJet"];
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    
    const departureHour = 6 + Math.floor(Math.random() * 15); // Voos entre 06:00 e 21:00
    const departureMinute = Math.random() > 0.5 ? '05' : (Math.random() > 0.5 ? '30' : '45');
    const durationHours = 1 + (Math.random() > 0.5 ? 1 : 0);
    const durationMinutes = Math.floor(Math.random() * 59);
    
    const arrivalHour = (departureHour + durationHours) % 24;
    
    const stops = Math.random() > 0.7 ? 1 : 0; // 30% de chance de ter uma escala

    return {
        id: `flight-${id}`,
        airline,
        flightNumber: `${airline.substring(0,2).toUpperCase()}${Math.floor(100 + Math.random() * 899)}`,
        departure: {
            time: `${String(departureHour).padStart(2, '0')}:${departureMinute}`,
            airport: isOutbound ? criteria.origin : criteria.destination,
            airportCode: (isOutbound ? criteria.origin : criteria.destination).substring(0, 3).toUpperCase(),
        },
        arrival: {
            time: `${String(arrivalHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
            airport: isOutbound ? criteria.destination : criteria.origin,
            airportCode: (isOutbound ? criteria.destination : criteria.origin).substring(0, 3).toUpperCase(),
        },
        duration: `${durationHours}h ${durationMinutes}m`,
        stops: stops,
    };
};


export const findFlights = async (criteria: SearchCriteria): Promise<FlightItinerary[]> => {
    // Simular atraso da API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results: FlightItinerary[] = [];
    const numberOfResults = 15 + Math.floor(Math.random() * 10);

    for (let i = 0; i < numberOfResults; i++) {
        const outbound = generateRandomFlight(i * 2, criteria, true);
        const inbound = generateRandomFlight(i * 2 + 1, criteria, false);
        const basePrice = 80 + Math.random() * 120; // Preço entre 80 e 200
        const finalPrice = Math.round(basePrice + (outbound.stops * 20) + (inbound.stops * 20));

        results.push({
            id: `itinerary-${i}`,
            outbound: outbound,
            inbound: inbound,
            totalPrice: finalPrice,
            totalDuration: `${Math.floor(Math.random() * 5 + 4)}h ${Math.floor(Math.random()*59)}m`
        });
    }

    return results;
};
