import { useState } from "react";
import { getBookingsByEmail } from "../api/FlightApi";

const BookingLookupPage = () => {
    const [email, setEmail] = useState("");
    const [bookings, setBookings] = useState<any[]>([]);

    const handleSearch = async () => {
        const data = await getBookingsByEmail(email);
        setBookings(data);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Find Bookings</h1>

            <input
                className="border p-2 rounded mr-2"
                placeholder="Enter passenger email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Search
            </button>

            <div className="mt-6 space-y-3">
                {bookings.map((booking, index) => (
                    <div key={index} className="bg-white p-4 rounded shadow">
                        <pre>{JSON.stringify(booking, null, 2)}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingLookupPage;