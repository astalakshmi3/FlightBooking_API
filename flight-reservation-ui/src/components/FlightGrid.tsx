import type { Flight } from "../types/Flight";
import FlightCard from "./FlightCard";

type Props = {
    flights: Flight[];
};

const FlightGrid = ({ flights }: Props) => {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
            ))}
        </div>
    );
};

export default FlightGrid;