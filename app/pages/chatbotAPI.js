export async function getChatResponse(userInput) {
  try {
    const response = await fetch("http://127.0.0.1:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Error getting response:", error);
    return "Sorry, I couldn't reach the AI service.";
  }
}
