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

const router = express.Router();

router.post("/api/gemini", async (req: Request, res: Response) => {
  const { role, level, experience, technologies, targetCompany, resumeText } =
    req.body;

  if (!role || !level || !experience || technologies.length === 0) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const prompt = `Generate 10 interview questions for the following details in the format of a single string separated by '|':
  - Role: ${role}
  - Level: ${level}
  - Experience: ${experience} years
  - Technologies: ${technologies.join(", ")}
  - Target Company: ${targetCompany || "Any"}
  - Resume Text: ${resumeText || "Not Provided"}

Ensure the first 8 questions include a mix of behavioral, technical, and resume-related questions that are concise, relevant, and suitable for the specified role, level, and experience. For example, include questions like:
- "Based on your resume, can you tell us about your experience with [specific technology or project]?"
- "How did your experience with [specific skill/technology] contribute to the success of your previous projects?"
- "Can you explain a challenging situation from your previous roles as described in your resume and how you overcame it?"

The last 2 questions should be coding problems according to the level and experience with the following structure:

Problem description: A concise explanation of the task.
Input: Clearly defined input format.
Output: Clearly defined output format.
Example:
  - Input: [example input]
  - Output: [expected output]

Return the output as a single string with each question separated by '|'.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const questions = responseText.split("|").map((q) => q.trim());

    res.json({ questions });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error.message);
    res.status(500).json({ message: "Error generating questions." });
  }
});

export default router;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
