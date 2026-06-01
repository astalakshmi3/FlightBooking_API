package se.lexicon.flightbooking_api.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import se.lexicon.flightbooking_api.dto.AvailableFlightDTO;
import se.lexicon.flightbooking_api.dto.BookFlightRequestDTO;
import se.lexicon.flightbooking_api.dto.FlightAssistantRequestDTO;
import se.lexicon.flightbooking_api.dto.FlightAssistantResponseDTO;
import se.lexicon.flightbooking_api.dto.FlightBookingDTO;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FlightAssistantServiceImpl implements FlightAssistantService {

    private final ChatClient chatClient;
    private final FlightBookingService flightBookingService;

    public FlightAssistantServiceImpl(
            ChatClient.Builder chatClientBuilder,
            FlightBookingService flightBookingService
    ) {
        this.flightBookingService = flightBookingService;

        this.chatClient = chatClientBuilder
                .defaultSystem("""
                        You are a helpful flight booking assistant.
                        Keep answers short.
                        Do not ask for departure city, travel dates, or passenger count.
                        Users can:
                        - show available flights
                        - book using flight number or destination, name, and email
                        - cancel booking using email
                        """)
                .build();
    }

    @Override
    public FlightAssistantResponseDTO chat(FlightAssistantRequestDTO request) {
        String message = request.message();
        String lowerMessage = message.toLowerCase();

        try {
            if (lowerMessage.contains("available") || lowerMessage.contains("show flights")) {
                return showAvailableFlights();
            }

            if (lowerMessage.contains("book")) {
                return bookFlight(message);
            }

            if (lowerMessage.contains("cancel")) {
                return cancelBooking(message);
            }

            return new FlightAssistantResponseDTO(
                    "I can help with:\n\n" +
                            "1. Show available flights\n" +
                            "2. Book flight FL006 for Sam with sam@gmail.com\n" +
                            "3. Book flight to Berlin for Sam with sam@gmail.com\n" +
                            "4. Cancel booking for sam@gmail.com"
            );

        } catch (Exception e) {
            return new FlightAssistantResponseDTO(
                    "Sorry, I could not complete the request. " + e.getMessage()
            );
        }
    }

    private FlightAssistantResponseDTO showAvailableFlights() {
        List<AvailableFlightDTO> flights = flightBookingService.findAvailableFlights();

        if (flights.isEmpty()) {
            return new FlightAssistantResponseDTO("No available flights found.");
        }

        StringBuilder response = new StringBuilder("✈ Available Flights\n\n");

        int count = 1;

        for (AvailableFlightDTO flight : flights) {
            response.append(count++)
                    .append(". Flight Number: ").append(flight.flightNumber()).append("\n")
                    .append("   Destination: ").append(flight.destination()).append("\n")
                    .append("   Departure: ").append(flight.departureTime()).append("\n")
                    .append("   Arrival: ").append(flight.arrivalTime()).append("\n")
                    .append("   Price: ").append(flight.price()).append(" SEK\n\n");
        }

        response.append("To book, type:\n");
        response.append("Book flight FL006 for Sam with sam@gmail.com\n");
        response.append("or\n");
        response.append("Book flight to Berlin for Sam with sam@gmail.com");

        return new FlightAssistantResponseDTO(response.toString());
    }

    private FlightAssistantResponseDTO bookFlight(String message) {
        String passengerName = extractName(message);
        String passengerEmail = extractEmail(message);
        AvailableFlightDTO selectedFlight = findSelectedFlight(message);

        if (selectedFlight == null) {
            return new FlightAssistantResponseDTO(
                    "Please provide a valid flight number or destination.\n\n" +
                            "Examples:\n" +
                            "Book flight FL006 for Sam with sam@gmail.com\n" +
                            "Book flight to Berlin for Sam with sam@gmail.com"
            );
        }

        if (passengerName == null || passengerName.isBlank()) {
            return new FlightAssistantResponseDTO(
                    "Please provide passenger name.\n\n" +
                            "Example:\n" +
                            "Book flight " + selectedFlight.flightNumber() + " for Sam with sam@gmail.com"
            );
        }

        if (passengerEmail == null || passengerEmail.isBlank()) {
            return new FlightAssistantResponseDTO(
                    "Please provide passenger email.\n\n" +
                            "Example:\n" +
                            "Book flight " + selectedFlight.flightNumber() + " for " + passengerName + " with sam@gmail.com"
            );
        }

        BookFlightRequestDTO bookingRequest =
                new BookFlightRequestDTO(passengerName, passengerEmail);

        FlightBookingDTO booking =
                flightBookingService.bookFlight(selectedFlight.id(), bookingRequest);

        return new FlightAssistantResponseDTO(
                "✅ Booking successful!\n\n" +
                        "Flight Number: " + booking.flightNumber() + "\n" +
                        "Destination: " + booking.destination() + "\n" +
                        "Passenger: " + booking.passengerName() + "\n" +
                        "Email: " + booking.passengerEmail()
        );
    }

    private FlightAssistantResponseDTO cancelBooking(String message) {
        String passengerEmail = extractEmail(message);

        if (passengerEmail == null || passengerEmail.isBlank()) {
            return new FlightAssistantResponseDTO(
                    "Please provide email to cancel booking.\n\n" +
                            "Example:\n" +
                            "Cancel booking for sam@gmail.com"
            );
        }

        List<FlightBookingDTO> bookings =
                flightBookingService.findBookingsByEmail(passengerEmail);

        if (bookings.isEmpty()) {
            return new FlightAssistantResponseDTO(
                    "No bookings found for " + passengerEmail
            );
        }

        for (FlightBookingDTO booking : bookings) {
            flightBookingService.cancelFlight(booking.id(), passengerEmail);
        }

        return new FlightAssistantResponseDTO(
                "✅ Booking cancelled successfully for " + passengerEmail
        );
    }

    private AvailableFlightDTO findSelectedFlight(String message) {
        String flightNumber = extractFlightNumber(message);

        if (flightNumber != null) {
            return flightBookingService.findAvailableFlights()
                    .stream()
                    .filter(flight -> flight.flightNumber().equalsIgnoreCase(flightNumber))
                    .findFirst()
                    .orElse(null);
        }

        String destination = extractDestination(message);

        if (destination != null) {
            return flightBookingService.findAvailableFlights()
                    .stream()
                    .filter(flight -> flight.destination().equalsIgnoreCase(destination))
                    .findFirst()
                    .orElse(null);
        }

        return null;
    }

    private String extractFlightNumber(String message) {
        Pattern pattern = Pattern.compile("FL\\d+", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return matcher.group().toUpperCase();
        }

        return null;
    }

    private String extractDestination(String message) {
        Pattern pattern = Pattern.compile("to\\s+([a-zA-Z]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return matcher.group(1).trim();
        }

        return null;
    }

    private String extractEmail(String message) {
        Pattern pattern =
                Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return matcher.group();
        }

        return null;
    }

    private String extractName(String message) {
        Pattern pattern =
                Pattern.compile("for\\s+(.+?)\\s+with", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return matcher.group(1).trim();
        }

        return null;
    }
}