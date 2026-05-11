import { useState } from "react";
import { Plane, Calendar, Clock, MapPin } from "lucide-react";
import type { Flight } from "../types/Flight";
import { bookFlight } from "../api/FlightApi";

type Props = {
    flight: Flight;
};

const FlightCard = ({ flight }: Props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleBook = async () => {
        try {
            await bookFlight(flight.id, name, email);
            setMessage("✅ Booking successful!");
            setName("");
            setEmail("");
        } catch {
            setMessage("❌ Booking failed");
        }
    };

    return (
        <div className="rounded-2xl bg-white p-5 shadow-md transition hover:shadow-xl hover:-translate-y-1">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Plane className="text-blue-700" size={22} />

                    <h2 className="text-xl font-bold text-blue-700">
                        {flight.flightNumber}
                    </h2>
                </div>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
          {flight.price} SEK
        </span>
            </div>

            {/* Info */}
            <div className="space-y-2 text-gray-700 text-sm">
                <p className="flex gap-2 items-center">
                    <MapPin size={16} className="text-blue-600" />
                    {flight.destination}
                </p>

                <p className="flex gap-2 items-center">
                    <Calendar size={16} className="text-blue-600" />
                    {new Date(flight.departureTime).toLocaleDateString()}
                </p>

                <p className="flex gap-2 items-center">
                    <Clock size={16} className="text-blue-600" />
                    {new Date(flight.departureTime).toLocaleTimeString()}
                </p>
            </div>

            {/* Form */}
            <div className="mt-4 space-y-2">
                <input
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Passenger name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Passenger email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    onClick={handleBook}
                    className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                    Book Flight
                </button>

                {message && (
                    <p className="text-center text-sm font-medium text-green-600">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FlightCard;