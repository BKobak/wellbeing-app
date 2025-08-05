import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFDocument from "pdfkit"; // at top with other imports
import stream from "stream";


// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialise Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate a summary of logs
function generateLogSummary(logs) {
  if (!Array.isArray(logs) || logs.length === 0) return "No logs available.";

  const summary = {
    totalLogs: logs.length,
    migraineCount: 0,
    headacheCount: 0,
    symptoms: {},
    earliest: null,
    latest: null,
  };

  logs.forEach(log => {
    if (log.type === 'Migraine') summary.migraineCount++;
    else if (log.type === 'Headache') summary.headacheCount++;

    if (Array.isArray(log.symptoms)) {
      log.symptoms.forEach(symptom => {
        summary.symptoms[symptom] = (summary.symptoms[symptom] || 0) + 1;
      });
    }

    const timestamp = new Date(log.timestamp);
    if (!summary.earliest || timestamp < summary.earliest) summary.earliest = timestamp;
    if (!summary.latest || timestamp > summary.latest) summary.latest = timestamp;
  });

  const symptomList = Object.entries(summary.symptoms)
    .map(([s, count]) => `${s} (${count} times)`)
    .join(', ');

  return `
- Logs recorded: ${summary.totalLogs}
- Headaches: ${summary.headacheCount}
- Migraines: ${summary.migraineCount}
- Date range: ${summary.earliest?.toDateString()} to ${summary.latest?.toDateString()}
- Symptoms reported: ${symptomList || 'None'}
`;
}

// Endpoint to handle chat messages
app.post("/chat", async (req, res) => {
  const { message, logs } = req.body;

  const logSummary = generateLogSummary(logs);

  const prompt = `
You are a health assistant supporting users with migraines and headaches.

The user said:
"${message}"

Here is a summary of their logged data:
${logSummary}

Use this information to give personalised, supportive responses. Do not make medical diagnoses. Always remind users this is not a substitute for professional care.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
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
- Monthly summaries (headaches, migraines, most frequent symptoms)
- A table or list of most common symptoms
- A section called "AI Insights" with:
  - Predicted next episode date (if calculable)
  - Most likely symptoms based on the logs
- A small footer note: "This is not a medical diagnosis. Please consult a healthcare professional for medical advice." 
Use plain text (no HTML).
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const reportText = response.text();

    // Create PDF
    const doc = new PDFDocument();
    const bufferStream = new stream.PassThrough();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=relief-nest-report.pdf");

    doc.pipe(bufferStream);
    doc.fontSize(14).text(reportText, {
      align: "left",
    });
    doc.end();

    bufferStream.pipe(res);
  } catch (error) {
    console.error("AI report generation error:", error);
    res.status(503).json({ error: "AI service unavailable or failed" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
