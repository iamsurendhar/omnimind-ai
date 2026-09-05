require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let activeChatModels = [];

async function loadAvailableChatModels() {
  const apiKey = (process.env.GROQ_API_KEY || "").trim();
  if (!apiKey || apiKey.includes("your_")) return;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();

    if (res.ok && data.data) {
      const allModelIds = data.data.map((m) => m.id);

      const nonChatKeywords = [
        "canopylabs",
        "orpheus",
        "whisper",
        "prompt-guard",
        "safeguard",
        "embed",
        "guard",
        "voice",
        "audio",
        "tts",
      ];

      activeChatModels = allModelIds.filter((id) => {
        const lower = id.toLowerCase();
        return !nonChatKeywords.some((keyword) => lower.includes(keyword));
      });

      activeChatModels.sort((a, b) => {
        const score = (name) => {
          if (name.includes("qwen3.6")) return 3;
          if (name.includes("qwen")) return 2;
          if (name.includes("gpt-oss")) return 1;
          return 0;
        };
        return score(b) - score(a);
      });
    }
  } catch (err) {}
}

loadAvailableChatModels();

app.get("/api/models", async (req, res) => {
  if (activeChatModels.length === 0) await loadAvailableChatModels();
  res.json({ models: activeChatModels });
});

app.get("/api/config", (req, res) => {
  const defaultModel = activeChatModels[0] || "qwen/qwen3.6-27b";
  res.json({
    appName: process.env.APP_NAME || "OmniMind AI",
    defaultModel: defaultModel,
    provider: "groq",
    timezone: process.env.APP_TIMEZONE || "UTC",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model } = req.body;
    const apiKey = (process.env.GROQ_API_KEY || "").trim();

    if (!apiKey || apiKey.includes("your_")) {
      return res
        .status(500)
        .json({ error: "Missing Groq API Key in environment variables." });
    }

    let targetModel = model;
    if (
      !targetModel ||
      (activeChatModels.length > 0 && !activeChatModels.includes(targetModel))
    ) {
      targetModel = activeChatModels[0] || "qwen/qwen3.6-27b";
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: targetModel,
          messages: messages,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error?.message || "Error from AI service." });
    }

    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
});

module.exports = app;
