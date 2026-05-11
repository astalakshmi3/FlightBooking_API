import { useState } from "react";
import { cancelBooking } from "../api/FlightApi";

const CancelBookingPage = () => {
    const [flightId, setFlightId] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleCancel = async () => {
        try {
            await cancelBooking(Number(flightId), email);
            setMessage("Booking cancelled successfully!");
        } catch {
            setMessage("Cancel failed. Please check Flight ID and email.");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Cancel Booking</h1>

            <div className="space-y-3 max-w-md">
                <input
                    className="border p-2 rounded w-full"
                    placeholder="Flight ID"
                    value={flightId}
                    onChange={(e) => setFlightId(e.target.value)}
                />

                <input
                    className="border p-2 rounded w-full"
                    placeholder="Passenger email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    onClick={handleCancel}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    Cancel Booking
                </button>

                {message && <p className="font-medium">{message}</p>}
            </div>
        </div>
    );
};

export default CancelBookingPage;