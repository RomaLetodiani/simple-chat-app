import express from "express";
import { OpenAI } from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "",
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).send("Invalid request body");
      return;
    }

    const response = await openai.chat.completions.create({
      model: "",
      temperature: 0.6,
      frequency_penalty: 1.2,
      messages: [
        {
          role: "system",
          content: ``,
        },
        ...messages,
      ],
    });

    const message = response.choices[0].message.content;

    if (!message) throw new Error("No response message");

    res.send(message);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
    return;
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
