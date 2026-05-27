package se.lexicon.flightbooking_api.controller;

import org.springframework.web.bind.annotation.*;
import se.lexicon.flightbooking_api.dto.FlightAssistantRequestDTO;
import se.lexicon.flightbooking_api.dto.FlightAssistantResponseDTO;
import se.lexicon.flightbooking_api.service.FlightAssistantService;

@RestController
@RequestMapping("/api/assistant")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightAssistantController {

    private FlightAssistantService flightAssistantService;

    public FlightAssistantController(FlightAssistantService flightAssistantService) {
        this.flightAssistantService = flightAssistantService;
    }
    @PostMapping("/chat")
    public FlightAssistantResponseDTO chat(@RequestBody FlightAssistantRequestDTO request) {
        return flightAssistantService.chat(request);
    }
}
