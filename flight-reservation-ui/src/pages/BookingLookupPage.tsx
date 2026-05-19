import { useState } from "react";
import { SearchCheck } from "lucide-react";
import { getBookingsByEmail } from "../api/FlightApi";

const BookingLookupPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSearch = async () => {
        try {
            const data = await getBookingsByEmail(email);

            if (data.length > 0) {
                setMessage(`✅ ${data.length} booking(s) found for ${email}`);
            } else {
                setMessage("❌ No bookings found for this email.");
            }
        } catch {
            setMessage("❌ Could not search bookings. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <div className="flex items-center gap-3 mb-6">
                <SearchCheck className="text-blue-700" size={32} />
                <h1 className="text-3xl font-bold text-gray-800">Find Bookings</h1>
            </div>

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

            {message && (
                <div className="mt-6 w-full max-w-2xl rounded-xl bg-white p-5 text-center font-medium shadow">
                    {message}
                </div>
            )}
        </div>
    );
};

export default BookingLookupPage;