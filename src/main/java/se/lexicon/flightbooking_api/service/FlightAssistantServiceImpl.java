package se.lexicon.flightbooking_api.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
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

    private String pendingCancelEmail = null;
    private boolean waitingForConfirmation = false;

    public FlightAssistantServiceImpl(
            ChatClient.Builder chatClientBuilder,
            FlightBookingService flightBookingService
    ) {
        this.flightBookingService = flightBookingService;

        ChatMemory chatMemory = MessageWindowChatMemory.builder()
                .maxMessages(10)
                .build();

        this.chatClient = chatClientBuilder
                .defaultSystem("""
                        You are a helpful flight booking assistant.
                        Keep answers short and friendly.
                        Do not ask for departure city, travel dates, or passenger count.

                        You can help users:
                        - show available flights
                        - book using flight number or destination, passenger name, and email
                        - cancel booking using email

                        Booking examples:
                        Book flight FL006 for Sam with sam@gmail.com
                        Book flight to Berlin for Sam with sam@gmail.com

                        Cancellation example:
                        Cancel booking for sam@gmail.com
                        """)
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build()
                )
                .build();
    }

    @Override
    public FlightAssistantResponseDTO chat(FlightAssistantRequestDTO request) {
        String message = request.message();
        String lowerMessage = message.toLowerCase();

        try {
            if (waitingForConfirmation) {
                return handleCancellationConfirmation(message);
            }

            if (lowerMessage.contains("available") || lowerMessage.contains("show flights")) {
                return showAvailableFlights();
            }

            if (lowerMessage.contains("cancel")) {
                return startCancellation(message);
            }

            if (lowerMessage.startsWith("book flight")) {
                return bookFlight(message);
            }

            String response = chatClient
                    .prompt()
                    .user(message)
                    .advisors(advisorSpec ->
                            advisorSpec.param(
                                    ChatMemory.CONVERSATION_ID,
                                    "flight-conversation"
                            )
                    )
                    .call()
                    .content();

            return new FlightAssistantResponseDTO(response);

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

        StringBuilder response = new StringBuilder("✈ Available Flights✈\n\n");

        for (AvailableFlightDTO flight : flights) {
            response.append("══════════════════════\n")
                    .append("✈ Flight Number: ")
                    .append(flight.flightNumber())
                    .append("\n")
                    .append("🌍 Destination: ")
                    .append(flight.destination())
                    .append("\n")
                    .append("📅 Departure: ")
                    .append(flight.departureTime())
                    .append("\n")
                    .append("🕒 Arrival: ")
                    .append(flight.arrivalTime())
                    .append("\n")
                    .append("💰 Price: ")
                    .append(flight.price())
                    .append(" SEK\n\n");

        }
        response.append("══════════════════════\n");
        response.append("\nTo book, type:\n");
        response.append("Book flight FL006 for YourName with your@email.com\n");
        response.append("or\n");
        response.append("Book flight to Berlin for YourName with your@email.com");

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
                            "Book flight " + selectedFlight.flightNumber() +
                            " for Sam with sam@gmail.com"
            );
        }

        if (passengerEmail == null || passengerEmail.isBlank()) {
            return new FlightAssistantResponseDTO(
                    "Please provide passenger email.\n\n" +
                            "Example:\n" +
                            "Book flight " + selectedFlight.flightNumber() +
                            " for " + passengerName + " with sam@gmail.com"
            );
        }

        BookFlightRequestDTO bookingRequest =
                new BookFlightRequestDTO(passengerName, passengerEmail);

        FlightBookingDTO booking =
                flightBookingService.bookFlight(selectedFlight.id(), bookingRequest);

        return new FlightAssistantResponseDTO(
                "══════════════════════════════\n" +
                        "✅ BOOKING SUCCESSFUL\n" +
                        "══════════════════════════════\n" +
                        "✈ Flight Number : " + booking.flightNumber() + "\n" +
                        "🌍 Destination  : " + booking.destination() + "\n" +
                        "👤 Passenger    : " + booking.passengerName() + "\n" +
                        "📧 Email        : " + booking.passengerEmail() + "\n" +
                        "══════════════════════════════"
        );
    }

    private FlightAssistantResponseDTO startCancellation(String message) {
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

        pendingCancelEmail = passengerEmail;
        waitingForConfirmation = true;

        StringBuilder response = new StringBuilder();
        response.append("⚠ Are you sure you want to cancel booking(s) for ")
                .append(passengerEmail)
                .append("?\n\n");

        response.append("Found booking(s):\n");

        for (FlightBookingDTO booking : bookings) {
            response.append("- ")
                    .append(booking.flightNumber())
                    .append(" to ")
                    .append(booking.destination())
                    .append("\n");
        }

        response.append("\nReply YES to confirm or NO to stop.");

        return new FlightAssistantResponseDTO(response.toString());
    }

    private FlightAssistantResponseDTO handleCancellationConfirmation(String message) {
        if (message.equalsIgnoreCase("yes")) {
            List<FlightBookingDTO> bookings =
                    flightBookingService.findBookingsByEmail(pendingCancelEmail);

            for (FlightBookingDTO booking : bookings) {
                flightBookingService.cancelFlight(booking.id(), pendingCancelEmail);
            }

            String email = pendingCancelEmail;

            pendingCancelEmail = null;
            waitingForConfirmation = false;

            return new FlightAssistantResponseDTO(
                    "✅ Booking cancelled successfully for " + email
            );
        }

        if (message.equalsIgnoreCase("no")) {
            pendingCancelEmail = null;
            waitingForConfirmation = false;

            return new FlightAssistantResponseDTO("❌ Cancellation cancelled.");
        }

        return new FlightAssistantResponseDTO("Please reply YES or NO.");
    }

    private AvailableFlightDTO findSelectedFlight(String message) {
        String flightNumber = extractFlightNumber(message);

        if (flightNumber != null) {
            return flightBookingService.findAvailableFlights()
                    .stream()
                    .filter(flight ->
                            flight.flightNumber().equalsIgnoreCase(flightNumber)
                    )
                    .findFirst()
                    .orElse(null);
        }

        String destination = extractDestination(message);

        if (destination != null) {
            return flightBookingService.findAvailableFlights()
                    .stream()
                    .filter(flight ->
                            flight.destination().equalsIgnoreCase(destination)
                    )
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
        Pattern pattern1 =
                Pattern.compile("for\\s+(.+?)\\s+with", Pattern.CASE_INSENSITIVE);
        Matcher matcher1 = pattern1.matcher(message);

        if (matcher1.find()) {
            return matcher1.group(1).trim();
        }

        Pattern pattern2 =
                Pattern.compile("name\\s*:?\\s*([a-zA-Z ]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher2 = pattern2.matcher(message);

        if (matcher2.find()) {
            return matcher2.group(1).trim();
        }

        return null;
    }
}