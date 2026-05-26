package se.lexicon.flightbooking_api.service;

import se.lexicon.flightbooking_api.dto.FlightAssistantRequestDTO;
import se.lexicon.flightbooking_api.dto.FlightAssistantResponseDTO;

public interface FlightAssistantService {
    FlightAssistantResponseDTO chat (FlightAssistantRequestDTO request);
}
