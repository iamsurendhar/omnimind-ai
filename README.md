# 🌐 OmniMind AI — Next-Gen Conversational AI Platform & Code Suite

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Groq Cloud AI](https://img.shields.io/badge/Groq-Cloud%20LPU-F55036?style=for-the-badge&logo=fastapi&logoColor=white)](https://console.groq.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**OmniMind AI** is an enterprise-grade, open-source conversational AI platform engineered with an authentic **ChatGPT-inspired interface**. Powered by **Groq Cloud's ultra-low latency LPU engine**, it delivers lightning-fast responses using state-of-the-art open-weight models (`qwen/qwen3.6-27b`, `llama-3.1-8b-instant`, and `openai/gpt-oss-120b`) at **100% zero cost**.

Designed with a single-file static frontend and a serverless backend, OmniMind AI is fully optimized for **Vercel Serverless deployment** with guaranteed zero routing or MIME-type errors.

---

## 📑 Table of Contents

1. [Key Features](#-key-features)
2. [Live Demo & Interface](#-live-demo--interface)
3. [Technology Stack](#-technology-stack)
4. [System Architecture](#-system-architecture)
5. [Project Directory Structure](#-project-directory-structure)
6. [Local Development Setup](#-local-development-setup)
7. [Environment Variables Guide](#-environment-variables-guide)
8. [Vercel Deployment Guide](#-vercel-deployment-guide)
9. [API Reference Documentation](#-api-reference-documentation)
10. [Automated Testing Suite](#-automated-testing-suite)
11. [Security & Privacy Standards](#-security--privacy-standards)
12. [Troubleshooting & FAQ](#-troubleshooting--faq)
13. [License](#-license)

---

## ✨ Key Features

### ⚡ Blazing-Fast & Free AI Engine

- **Powered by Groq Cloud API:** Runs open-weights models at 300+ tokens/second.
- **Dynamic Model Discovery:** Automatically queries your API key on boot and exposes only verified, active chat models (such as `qwen/qwen3.6-27b` and `llama-3.1-8b-instant`).
- **Clean Response Pipeline:** Filters out raw `<think>` tags and verbose reasoning traces to ensure only clean, final answers are shown.

### 💻 Enterprise Code Block Experience

- **Auto Syntax Highlighting:** Integrated with `Highlight.js` (Atom One Dark theme) and `Marked.js`.
- **▷ Live Web Preview Modal:** Instantly executes and renders HTML, CSS, and JavaScript in an isolated, secure browser sandbox (`<iframe>`).
- **⤓ Single-Click File Download:** Directly downloads code blocks with correct file extensions (`.html`, `.js`, `.py`, `.css`, `.json`, `.cpp`, etc.).
- **⧉ One-Click Copy:** Instant clipboard copy with visual confirmation.
- **⌵ Collapsible Code Containers:** Smooth slide-up/slide-down toggle for long scripts.
- **Fixed Typography & Case Sensitivity:** Forces standard code casing (no all-caps bugs) with unrestricted vertical expansion.

### 🎯 Strict User Personalization

- Configure custom instructions and developer personas in the **Personalization Modal**.
- System dynamically injects your instructions as high-priority constraints that the AI strictly obeys in every response.

### 🌓 Theme & Multi-Language (i18n) Engine

- **Light & Dark Mode:** Real-time adaptive color switching for sidebars, text, tables, modals, and code containers.
- **Multi-Language Support (i18n):** Instant UI localization for **English, Tamil (தமிழ்), Spanish (Español), French (Français), and German (Deutsch)**.
- **Full State Persistence:** Saves themes, languages, and conversation records in browser `localStorage`.

### 🗂️ Conversation Management

- **Persistent Storage:** Conversations and messages remain saved permanently. Deleted chats never reappear on page refresh.
- **Pin & Unpin:** Pin critical conversations to the top of the sidebar.
- **Inline Rename:** Modal-based renaming for chat titles.
- **Direct Deletion:** Instant chat deletion with fallback screen handling.
- **Message Action Bar:** Integrated Like, Dislike, and Copy feedback buttons on assistant messages.

---

## 🛠️ Technology Stack

| Layer                   | Technology              | Purpose                                           |
| :---------------------- | :---------------------- | :------------------------------------------------ |
| **Frontend Framework**  | HTML5, Tailwind CSS CDN | Lightweight, reactive UI layout                   |
| **Client-side Logic**   | jQuery 3.7.1            | DOM manipulation, state management, AJAX          |
| **Markdown Parser**     | Marked.js               | Renders headers, lists, bold text, and paragraphs |
| **Syntax Highlighter**  | Highlight.js            | Code block syntax highlighting                    |
| **Icon Library**        | Feather Icons           | Modern, lightweight SVG iconography               |
| **Backend Runtime**     | Node.js (v18+)          | Serverless API runtime                            |
| **Web Framework**       | Express.js              | API routing and proxy middleware                  |
| **AI Cloud API**        | Groq Cloud LPU          | High-speed LLM inference engine                   |
| **Deployment Platform** | Vercel                  | Global Edge CDN & Serverless deployment           |

---

## 🏗️ System Architecture

```
[ User Browser (Client) ]
        │
        ├──► Static UI: Single-file HTML (index.html)
        │
        └──► AJAX POST /api/chat
                    │
                    ▼
        [ Vercel Serverless Function ]
              ( Express api/index.js )
                    │
                    ├──► Reads GROQ_API_KEY from process.env (Hidden)
                    ├──► Dynamically injects Personalization & System Prompt
                    │
                    ▼
            [ Groq Cloud LPU API ]
        ( qwen/qwen3.6-27b / Llama 3.1 )
                    │
                    ▼
        [ Sanitized JSON Response ]
                    │
                    ▼
        [ Client DOM / Markdown Renderer ]
```

---

## 📁 Project Directory Structure

```text
omnimind-ai/
│
├── api/
│   └── index.js          # Express backend API handler & Groq proxy
├── index.html        # Complete frontend application (UI, CSS, JS)
│
├── .env                  # Local secret environment variables (Never committed)
├── .gitignore            # Git exclusion rules (Protects .env & node_modules)
├── vercel.json           # Vercel serverless routing & bundle configurations
├── package.json          # Node dependencies, engines, and npm scripts
├── test.js               # Automated endpoint & server integration test suite
├── README.md             # Complete master documentation
└── LICENSE               # MIT Open Source License
```

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js:** v18.0.0 or higher ([Download](https://nodejs.org))
- **Groq API Key:** Free API key from [Groq Console](https://console.groq.com/keys)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/omnimind-ai.git
cd omnimind-ai
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root folder:

```env
# Application Settings
APP_NAME="OmniMind AI"
APP_DESCRIPTION="Next-Generation Conversational AI Assistant"
APP_URL="https://omnimind.ai"
APP_TIMEZONE="Asia/Kolkata"

# AI Provider Configuration
AI_PROVIDER="groq"

# 1. Groq Free API Key (https://console.groq.com/keys)
GROQ_API_KEY="gsk_your_actual_groq_api_key_here"

# 2. OpenAI API Key (Optional)
OPENAI_API_KEY=""

# Default Verified Chat Model
DEFAULT_MODEL="qwen/qwen3.6-27b"

# Local Server Port
PORT=3000
```

### Step 4: Run the Application Locally

```bash
npm start
```

Visit `http://localhost:3000` in your browser.

---

## ☁️ Vercel Deployment Guide

Deploy your private or public instance to Vercel in less than 2 minutes.

### Method 1: Deploy via GitHub (Recommended)

**Commit and Push Code to GitHub:**

```bash
git add .
git commit -m "Initial commit for Vercel deployment"
git branch -M main
git push -u origin main
```

**Import Project into Vercel:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** ➔ **"Project"**.
3. Select your GitHub repository and click **"Import"**.

**Set Environment Variables in Vercel:**

Under the "Environment Variables" dropdown, add:

- `GROQ_API_KEY`: Your Groq API key (`gsk_...`)
- `DEFAULT_MODEL`: `qwen/qwen3.6-27b`
- `AI_PROVIDER`: `groq`

**Click "Deploy":**

Your live application will be available at `https://your-project.vercel.app`.

---

## 📡 API Reference Documentation

### 1. Health & Models Endpoint

Retrieves the list of active chat completion models discovered on the active provider account.

- **URL:** `/api/models`
- **Method:** `GET`

**Response Example:**

```json
{
  "models": [
    "qwen/qwen3.6-27b",
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "allam-2-7b"
  ]
}
```

### 2. Configuration Endpoint

Retrieves public application configurations safely without exposing secret keys.

- **URL:** `/api/config`
- **Method:** `GET`

**Response Example:**

```json
{
  "appName": "OmniMind AI",
  "defaultModel": "qwen/qwen3.6-27b",
  "provider": "groq",
  "timezone": "Asia/Kolkata"
}
```

### 3. Chat Completion Endpoint

Proxies the conversational prompt to the Groq LPU engine.

- **URL:** `/api/chat`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`

**Request Body Example:**

```json
{
  "model": "qwen/qwen3.6-27b",
  "messages": [
    { "role": "system", "content": "You are OmniMind AI. Answer concisely." },
    { "role": "user", "content": "Write a simple HTML button." }
  ]
}
```

**Response Example (200 OK):**

````json
{
  "id": "chatcmpl-12345",
  "object": "chat.completion",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "```html\n<button class=\"btn\">Click Me</button>\n```"
      },
      "finish_reason": "stop"
    }
  ]
}
````

---

## 🧪 Automated Testing Suite

OmniMind AI includes a zero-dependency automated endpoint test suite using Node's native `assert` and `http` modules.

### Running Tests

```bash
npm test
```

### Verified Test Cases:

- **Root Route (`GET /`):** Verifies `/index.html` is properly served with `200 OK`.
- **Config Endpoint (`GET /api/config`):** Validates the JSON schema and provider settings.
- **Models Endpoint (`GET /api/models`):** Ensures an array of working chat models is returned.
- **Chat Endpoint (`POST /api/chat`):** Verifies request validation and API payload handling.

---

## 🔒 Security & Privacy Standards

- **Zero Client-Side Secret Exposure:** The `GROQ_API_KEY` is only stored in `.env` (or Vercel Environment Variables) and is executed exclusively on the serverless backend.
- **Git Protection (`.gitignore`):** Automatically excludes `.env`, `node_modules/`, and local caches from being uploaded to public or private Git repositories.
- **XSS Protection:** Client-side user input is escaped using `escapeHtml()` helpers before DOM injection.
- **Sanitized Iframe Sandbox:** Live code preview frames use isolated `sandbox="allow-scripts"` attributes to prevent sandbox escape vulnerabilities.

---

## ❓ Troubleshooting & FAQ

**1. Why does Vercel return `Cannot GET /`?**

Ensure your `vercel.json` includes the root routing rule and `api/index.js` contains the root `app.get('/', ...)` handler pointing to `index.html`.

**2. Why did I get a `model_not_found` error?**

Some preview models get deprecated. OmniMind AI uses `qwen/qwen3.6-27b` which is active across all Groq accounts.

**3. How do I change the default AI model?**

Update the `DEFAULT_MODEL` variable in your `.env` or in Vercel's Environment Variables dashboard.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Built with ❤️ using Groq Cloud, Tailwind CSS, Express, and Vercel.
