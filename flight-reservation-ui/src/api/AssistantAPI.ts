const BASE_URL = "http://localhost:8080/api/assistant";

export async function sendMessage(message: string) {
    const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error("Assistant request failed");
    }

    return response.json();
}