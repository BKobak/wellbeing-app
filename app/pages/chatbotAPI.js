import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getChatResponse(userInput) {
  try {
    // Retrieve existing logs from AsyncStorage
    const storedLogs = await AsyncStorage.getItem('logs');
    const logs = storedLogs ? JSON.parse(storedLogs) : [];

    // Add the new user input to the logs
    const response = await fetch("http://127.0.0.1:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput, logs }),
    });

    // Check if the response is correct
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Error getting response:", error);
    return "Sorry, I couldn't reach the AI service.";
  }
}
