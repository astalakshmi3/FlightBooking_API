import { useEffect, useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { sendMessage } from "../api/AssistantAPI";

type ChatMessage = {
    sender: "user" | "assistant";
    text: string;
};

const Chatbot = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            sender: "assistant",
            text: "Hello! I can help you search flights, book a flight, or cancel a booking.",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input;

        const userMessage: ChatMessage = {
            sender: "user",
            text: userText,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const data = await sendMessage(userText);

            const assistantMessage: ChatMessage = {
                sender: "assistant",
                text: data.response,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "assistant",
                    text: "Sorry, something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex h-[600px] max-w-3xl flex-col rounded-3xl bg-white shadow-xl">
            <div className="flex items-center gap-3 rounded-t-3xl bg-blue-700 p-5 text-white">
                <Bot />
                <div>
                    <h2 className="text-xl font-bold">Flight Assistant</h2>
                    <p className="text-sm text-blue-100">
                        Ask about flights, bookings, and cancellations
                    </p>
                </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-2 ${
                            message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        {message.sender === "assistant" && (
                            <Bot className="mt-1 text-blue-700" size={22} />
                        )}

                        <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words font-sans ${
                                message.sender === "user"
                                    ? "bg-blue-700 text-white"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {message.text}
                        </div>

                        {message.sender === "user" && (
                            <User className="mt-1 text-gray-600" size={22} />
                        )}
                    </div>
                ))}

                {loading && (
                    <p className="text-sm text-gray-500">Assistant is typing...</p>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 border-t p-4">
                <input
                    className="flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                />

                <button
                    onClick={handleSend}
                    className="rounded-xl bg-blue-700 px-5 text-white hover:bg-blue-800"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;