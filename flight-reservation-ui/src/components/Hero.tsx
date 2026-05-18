import { PlaneTakeoff } from "lucide-react";

const Hero = () => {
    return (
        <section className="mb-10 rounded-2xl bg-blue-700 p-8 text-white shadow-xl">
            <div className="flex items-center gap-4">
                <PlaneTakeoff size={42} />
                <div>
                    <h1 className="text-4xl font-bold">BOOK YOUR FLIGHT</h1>
                    <p className="mt-2 text-blue-100">
                        View flights, book tickets, search bookings, and cancel reservations.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Hero;