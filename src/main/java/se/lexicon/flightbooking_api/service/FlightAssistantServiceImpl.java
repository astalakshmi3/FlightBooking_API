package se.lexicon.flightbooking_api.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import se.lexicon.flightbooking_api.dto.FlightAssistantRequestDTO;
import se.lexicon.flightbooking_api.dto.FlightAssistantResponseDTO;

@Service
public class  FlightAssistantServiceImpl implements FlightAssistantService {

    private final ChatClient chatClient;

    public FlightAssistantServiceImpl(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
                .defaultSystem("""
                        You are a helpful flight booking assistant.
                        You help users search available flights, book flights, and cancel bookings.
                        Ask for missing information step by step.
                        Do not guess passenger name, email, or flight ID.
                        Keep answers short and friendly.
                        """)
                .build();

    }
    @Override
    public FlightAssistantResponseDTO chat(FlightAssistantRequestDTO request) {
        String message = chatClient
                .prompt()
                .user(request.message())
                .call()
                .content();
        return new FlightAssistantResponseDTO(message);
    }
}
