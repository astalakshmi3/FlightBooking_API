import { useEffect, useState } from "react";
import {getAllFlights} from "../api/FlightApi.ts";
import type { Flight } from "../types/Flight";
import {Plane} from "lucide-react";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import StatusMessage from "../components/StatusMessage";
import FlightGrid from "../components/FlightGrid";

const AllFlightsPage = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getAllFlights()
            .then(setFlights)
            .catch(() => setError("Could not load flights. Please check backend."))
            .finally(() => setLoading(false));
    }, []);

    const filteredFlights = flights.filter(
        (flight) =>
            flight.destination.toLowerCase().includes(search.toLowerCase()) ||
            flight.flightNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <Hero />

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <Plane className="text-blue-700" size={34} />

                    <h2 className="text-3xl font-bold text-gray-800">
                        All Flights
                    </h2>
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

export default AllFlightsPage;