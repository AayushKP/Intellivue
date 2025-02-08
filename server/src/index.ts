import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure the GEMINI_API_KEY is set in your environment variables.
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

app.post("/api/gemini", async (req: Request, res: Response) => {
  const prompt =
    "Generate a challenging C++ interview question and dont give me any other text than question separate each question by | ";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const responseText = result.response.text();

    const question = responseText.split("|")[0].trim();

    res.json({ question });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error.message);
    res.status(500).json({ message: "Error generating question." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
