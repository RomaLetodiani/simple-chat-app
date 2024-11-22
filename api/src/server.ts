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
  baseURL: process.env.OPENAI_API_BASE_URL,
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

    const stream = await openai.chat.completions.create({
      stream: true,
      model: "",
      temperature: 0.4,
      frequency_penalty: 1.2,
      messages: [
        {
          role: "system",
          content: "",
        },
        ...messages,
      ],
    });

    for await (const part of stream) {
      // here express will stream the response
      res.write(part.choices[0]?.delta.content || "");
    }
    // here express sends the closing/done/end signal for the stream consumer
    res.end();

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
