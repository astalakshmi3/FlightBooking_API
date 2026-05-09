import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="bg-blue-700 text-white p-4 flex gap-6 items-center">
            <div className="flex items-center gap-2 font-bold">
                <Plane />
                Flight Booking
            </div>

            <Link to="/">All Flights</Link>
            <Link to="/available">Available Flights</Link>
            <Link to="/bookings">Find Bookings</Link>
            <Link to="/cancel">Cancel Booking</Link>
        </nav>
    );
};

export default Navbar;