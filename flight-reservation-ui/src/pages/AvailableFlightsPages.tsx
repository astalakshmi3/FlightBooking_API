import { useEffect, useState } from "react";
import { getAvailableFlights } from "../api/FlightApi";
import type { Flight } from "../types/Flight";
import { PlaneTakeoff } from "lucide-react";
import SearchBar from "../components/SearchBar";
import StatusMessage from "../components/StatusMessage";
import FlightGrid from "../components/FlightGrid";

const AvailableFlightsPage = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getAvailableFlights()
            .then(setFlights)
            .catch(() => setError("Could not load available flights."))
            .finally(() => setLoading(false));
    }, []);

    const filteredFlights = flights.filter(
        (flight) =>
            flight.destination.toLowerCase().includes(search.toLowerCase()) ||
            flight.flightNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <PlaneTakeoff className="text-green-600" size={34} />

                    <h1 className="text-3xl font-bold text-gray-800">
                        Available Flights
                    </h1>
                </div>

                <SearchBar search={search} onSearchChange={setSearch} />
            </div>

            <StatusMessage
                loading={loading}
                error={error}
                empty={!loading && !error && filteredFlights.length === 0}
            />

            {!loading && !error && filteredFlights.length > 0 && (
                <FlightGrid flights={filteredFlights} />
            )}
        </main>
    );
};

export default AvailableFlightsPage;