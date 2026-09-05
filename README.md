# OmniMind AI — Next-Generation Conversational AI & Code Canvas

![OmniMind AI Banner](https://img.shields.io/badge/OmniMind-AI%20Assistant-10b981?style=for-the-badge&logo=openai&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

OmniMind AI is an open-source, full-stack conversational AI platform built with a sleek **ChatGPT-inspired interface**, powered by **Groq Cloud API** for ultra-fast, zero-cost intelligence. It features real-time conversation management, live code previews, full multi-language localization (i18n), and custom personalization.

---

## ✨ Features

- ⚡ **100% Free & Fast AI:** Powered by Groq Cloud API with native support for `qwen/qwen3.6-27b`, `llama-3.1-8b-instant`, and `openai/gpt-oss-120b`.
- 💻 **Interactive Code Renderer:**
  - Auto-formatted syntax highlighting with language detection.
  - **Live Web Preview Modal:** Instantly run HTML/CSS/JS code in a live sandbox iframe.
  - **Single-Click File Download:** Download generated code as `.html`, `.js`, `.py`, `.css`, etc.
  - **One-Click Clipboard Copy:** Instant copy with visual confirmation.
  - **Collapsible Code Blocks:** Smooth slide-up/slide-down toggle.
- 🎯 **Strict User Personalization:** Set custom AI personas, instructions, and coding preferences that the AI strictly obeys.
- 🌓 **Dynamic Theme Engine:** Seamless switching between Light and Dark themes with full local storage persistence.
- 🌐 **Multi-Language Support (i18n):** Native support for English, Tamil (தமிழ்), Spanish (Español), French (Français), and German (Deutsch).
- 🗂️ **Real-Time Conversation Management:**
  - Pin important chats to the top.
  - Rename conversation titles.
  - Permanent deletion with LocalStorage synchronization.
- 📱 **100% Responsive Design:** Smooth drawer sidebar navigation for mobile devices and collapsible desktop view.
- 🚀 **Serverless Ready:** Built with native Vercel Serverless deployment configurations.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS, jQuery, Marked.js, Highlight.js, Feather Icons.
- **Backend:** Node.js, Express.js (Vercel Serverless Functions).
- **AI Infrastructure:** Groq Cloud API / OpenAI API.
- **Hosting:** Vercel.

---

## 📁 Project Structure

```text
omnimind-ai/
├── .env                  # Environment variables (Local secrets)
├── .gitignore            # Git ignore configuration
├── vercel.json           # Vercel serverless routing configuration
├── package.json          # Node dependencies and scripts
├── server.js             # Express backend server & API proxy
├── test.js               # Automated endpoint test suite
├── index.html            # Main frontend application markup
├── LICENSE               # MIT License
├── README.md             # Project documentation
├── css/
│   └── style.css         # Adaptive light/dark stylesheet
└── js/
    └── app.js            # Client-side application logic
```
