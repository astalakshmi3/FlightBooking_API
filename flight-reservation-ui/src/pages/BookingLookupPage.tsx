import { useState } from "react";
import { SearchCheck } from "lucide-react";
import { getBookingsByEmail } from "../api/FlightApi";

const BookingLookupPage = () => {
    const [email, setEmail] = useState("");
    const [bookings, setBookings] = useState<any[]>([]);

    const handleSearch = async () => {
        const data = await getBookingsByEmail(email);
        setBookings(data);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

            {/* Title */}
            <div className="flex items-center gap-3 mb-6">
                <SearchCheck className="text-blue-700" size={32} />

                <h1 className="text-3xl font-bold text-gray-800">
                    Find Bookings
                </h1>
            </div>

            {/* Search Box */}
            <div className="flex flex-col md:flex-row gap-3 w-full max-w-2xl justify-center items-center">

                <input
                    className="w-full rounded-xl border bg-white px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter passenger email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    onClick={handleSearch}
                    className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                >
                    Search
                </button>
            </div>

            {/* Output */}
            <div className="mt-8 w-full max-w-3xl space-y-4">
                {bookings.map((booking, index) => (
                    <div
                        key={index}
                        className="rounded-2xl bg-white p-5 shadow-md"
                    >
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {JSON.stringify(booking, null, 2)}
            </pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingLookupPage;