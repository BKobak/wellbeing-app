import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint to handle chat messages
app.post("/chat", async (req, res) => {
  const userInput = req.body.message;
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userInput);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});


// Endpoint to generate AI-based HTML report
app.post("/report", async (req, res) => {
  const logs = req.body.logs;

  if (!Array.isArray(logs) || logs.length === 0) {
    return res.status(400).json({ error: "Invalid or missing logs array" });
  }

  const prompt = `
You are an AI assistant generating a monthly health report for migraine/headache tracking.

Here are the user logs:
${JSON.stringify(logs, null, 2)}

Generate a full report with:
- Title: "Relief Nest Health Report"
- Use headings, paragraphs, and lists for clarity
- Monthly summaries (headaches, migraines, most frequent symptoms)
- Table of most common symptoms
- A section called "AI Insights" with:
  - Predicted next episode date (if calculable)
  - Most likely symptoms based on the logs
- A small footer note: "This is not a medical diagnosis. Please consult a healthcare professional for medical advice." 
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const html = response.text();

    if (!html || !html.includes("<html")) {
      return res.status(500).json({ error: "Invalid HTML returned from AI" });
    }

    res.json({ html });
  } catch (error) {
    console.error("AI report generation error:", error);
    res.status(503).json({ error: "AI service unavailable or failed" });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
