import { useState } from "react";
import { TicketX } from "lucide-react";
import { cancelBooking } from "../api/FlightApi";

const CancelBookingPage = () => {
    const [flightId, setFlightId] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleCancel = async () => {
        try {
            await cancelBooking(Number(flightId), email);

            setMessage("✅ Booking cancelled successfully!");

            setFlightId("");
            setEmail("");
        } catch {
            setMessage("❌ Cancel failed. Please check Flight ID and email.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">

            {/* Card */}
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

                {/* Header */}
                <div className="mb-6 flex items-center justify-center gap-3">
                    <TicketX className="text-red-600" size={34} />

                    <h1 className="text-3xl font-bold text-gray-800">
                        Cancel Booking
                    </h1>
                </div>

                {/* Inputs */}
                <div className="space-y-4">

                    <input
                        className="w-full rounded-xl border px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="Enter Flight ID"
                        value={flightId}
                        onChange={(e) => setFlightId(e.target.value)}
                    />

                    <input
                        className="w-full rounded-xl border px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="Enter Passenger Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Button */}
                    <button
                        onClick={handleCancel}
                        className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
                    >
                        Cancel Booking
                    </button>

                    {/* Message */}
                    {message && (
                        <p className="rounded-xl bg-gray-100 p-3 text-center font-medium text-gray-700">
                            {message}
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CancelBookingPage;