package se.lexicon.flightbooking_api.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.stereotype.Service;
import se.lexicon.flightbooking_api.dto.FlightAssistantRequestDTO;
import se.lexicon.flightbooking_api.dto.FlightAssistantResponseDTO;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;


@Service
public class  FlightAssistantServiceImpl implements FlightAssistantService {

    private final ChatClient chatClient;


    public FlightAssistantServiceImpl(ChatClient.Builder chatClientBuilder) {
        ChatMemory chatMemory = MessageWindowChatMemory.builder()
                .maxMessages(10)
                .build();
        this.chatClient = chatClientBuilder
                .defaultSystem("""
                        You are a helpful flight booking assistant.
                        You help users search available flights, book flights, and cancel bookings.
                        Ask for missing information step by step.
                        Do not guess passenger name, email, or flight ID.
                        Keep answers short and friendly.
                        """)
                .defaultAdvisors (MessageChatMemoryAdvisor.builder(chatMemory)
                        .build()
                )
                .build();

    }
    @Override
    public FlightAssistantResponseDTO chat(FlightAssistantRequestDTO request) {
        String message = chatClient
                .prompt()
                .user(request.message())
                .advisors(advisorSpec ->
                        advisorSpec.param(
                                ChatMemory.CONVERSATION_ID,
                                "flight-conversation"
                        )
                )
                .call()
                .content();
        return new FlightAssistantResponseDTO(message);
    }
}
