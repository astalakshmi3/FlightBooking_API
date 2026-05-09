const BASE_URL = "http://localhost:8080/api/flights";

export async function getAllFlights() {
    const response = await fetch(BASE_URL);
    return response.json();
}

export async function getAvailableFlights() {
    const response = await fetch(`${BASE_URL}/available`);
    return response.json();
}

export async function bookFlight(
    flightId: number,
    passengerName: string,
    passengerEmail: string
) {
    const response = await fetch(`${BASE_URL}/${flightId}/book`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            passengerName,
            passengerEmail,
        }),
    });

    if (!response.ok) {
        throw new Error("Booking failed");
    }

    return response.json();
}

export async function getBookingsByEmail(email: string) {
    const response = await fetch(`${BASE_URL}/bookings?email=${email}`);
    return response.json();
}

export async function cancelBooking(flightId: number, email: string) {
    const response = await fetch(`${BASE_URL}/${flightId}/cancel?email=${email}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Cancel booking failed");
    }

    return response.text();
}