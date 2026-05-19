import { useState } from "react";
import { Calendar, Clock, MapPin, Plane } from "lucide-react";
import type { Flight } from "../types/Flight";
import { bookFlight } from "../api/FlightApi";

type Props = {
    flight: Flight;
};

const FlightCard = ({ flight }: Props) => {
    const [passengerName, setPassengerName] = useState("");
    const [passengerEmail, setPassengerEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleBook = async () => {
        try {
            await bookFlight(flight.id, passengerName, passengerEmail);
            setMessage("✅ Booking successful!");
            setPassengerName("");
            setPassengerEmail("");
        } catch {
            setMessage("❌ Booking failed.");
        }
    };

    return (
        <div className="flex h-full flex-col justify-between rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Plane size={18} className="text-blue-700" />
                        <h2 className="text-xl font-bold text-blue-700">
                            {flight.flightNumber}
                        </h2>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            {flight.price} SEK
          </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                        <MapPin size={12} className="text-blue-600" />
                        {flight.destination}
                    </p>

                    <p className="flex items-center gap-2">
                        <Calendar size={12} className="text-blue-600" />
                        {new Date(flight.departureTime).toLocaleDateString()}
                    </p>

                    <p className="flex items-center gap-2">
                        <Clock size={12} className="text-blue-600" />
                        {new Date(flight.departureTime).toLocaleTimeString()}
                    </p>
                </div>
            </div>

            <div className="mt-3 space-y-2">
                <input
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Passenger name"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                />

                <input
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Passenger email"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                />

                <button
                    onClick={handleBook}
                    className="w-full rounded-lg bg-blue-700 py-2 font-semibold text-white hover:bg-blue-800"
                >
                    Book Flight
                </button>

                {message && (
                    <p className="rounded-lg bg-green-100 p-2 text-center text-sm font-medium text-green-700">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FlightCard;