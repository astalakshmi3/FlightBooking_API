import {
    Plane,
    PlaneTakeoff,
    SearchCheck,
    TicketX,
} from "lucide-react";

import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-blue-700 text-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                <div className="flex items-center gap-2 text-xl font-bold">
                    <Plane size={24} />
                    Flight Booking
                </div>

                <div className="flex gap-6 text-sm font-medium">

                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:text-blue-200"
                    >
                        <Plane size={18} />
                        All Flights
                    </Link>

                    <Link
                        to="/available"
                        className="flex items-center gap-2 hover:text-blue-200"
                    >
                        <PlaneTakeoff size={18} />
                        Available Flights
                    </Link>

                    <Link
                        to="/bookings"
                        className="flex items-center gap-2 hover:text-blue-200"
                    >
                        <SearchCheck size={18} />
                        Find Bookings
                    </Link>

                    <Link
                        to="/cancel"
                        className="flex items-center gap-2 hover:text-blue-200"
                    >
                        <TicketX size={18} />
                        Cancel Booking
                    </Link>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;