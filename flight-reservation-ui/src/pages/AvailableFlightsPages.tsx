import { useEffect, useState } from "react";
import { PlaneTakeoff } from "lucide-react";
import { getAvailableFlights } from "../api/FlightApi";
import type { Flight } from "../types/Flight";
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
            <section className="mb-8 rounded-2xl bg-green-700 p-8 text-white shadow-xl">
                <div className="flex items-center gap-4">
                    <PlaneTakeoff size={42} />

                    <div>
                        <h1 className="text-4xl font-bold">Available Flights</h1>
                        <p className="mt-2 text-green-100">
                            Choose from flights that are currently available for booking.
                        </p>
                    </div>
                </div>
            </section>

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                    {filteredFlights.length} Available Flight(s)
                </h2>

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