export function testChatbot() {
  const results = [];

  try {
    const mockInput = "I have a headache and nausea";
    const response = "It sounds like you might be experiencing a migraine."; // expected part
    // Replace this with your real function
    const result = mockChatbotReply(mockInput);
    
    results.push({
      name: 'Chatbot basic reply includes migraine',
      pass: result.includes('migraine'),
      error: result,
    });
  } catch (err) {
    results.push({ name: 'Chatbot basic reply', pass: false, error: err.message });
  }

  return results;
}

function mockChatbotReply(msg) {
  // This mimics your chatbot logic
  if (msg.includes("nausea")) return "It sounds like you might be experiencing a migraine.";
  return "I'm not sure, can you tell me more?";
}
