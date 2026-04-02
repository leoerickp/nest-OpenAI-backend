# Nest-GPT Backend

A structured backend implementation built with [NestJS](https://nestjs.com/) that integrates various services and models from the **OpenAI** API. It is designed to act as the brain of your application and be consumed by a frontend application (e.g., built with React).

## 🚀 Technologies

This project is built using the following tools and libraries:

- **[NestJS](https://nestjs.com/):** A robust Node.js framework built with TypeScript.
- **[OpenAI Node SDK](https://github.com/openai/openai-node):** The official client to communicate with AI models (GPT, DALL-E, Whisper, TTS).
- **TypeScript:** The primary programming language.
- **Multer:** Middleware for handling `multipart/form-data` file uploads, essential for audio and image endpoints.
- **Sharp:** High-performance image processing library used to resize and ensure the correct format of images before sending them to DALL-E.

## ✨ Features and Use Cases (Endpoints)

The API provides various controllers inside the GPT module, exposing endpoints for the following use cases:

- 📝 **Orthography Check (`/api/gpt/orthography-check`):** Reviews and suggests spelling and grammar corrections for a given text.
- 💬 **Pros and Cons Discusser (`/api/gpt/pros-cons-discusser`):** Performs a structured analysis of the positive and negative aspects of any topic. It also includes a **Streaming** endpoint to respond in real-time via _Server-Sent Events_.
- 🌍 **Translate (`/api/gpt/translate`):** Translates text strings into a requested language.
- 🎙️ **Text to Audio (`/api/gpt/text-to-audio`):** Converts text into MP3 files using OpenAI's TTS models, with different natural voices available.
- 🎧 **Audio to Text (`/api/gpt/audio-to-text`):** Full transcription of a voice message uploaded as a media file, powered by the **Whisper** model.
- 🖼️ **Image Generation (`/api/gpt/image-generation`):** Creates stunning images from text descriptions using **DALL-E 3**.
- 🌟 **Image Variation (`/api/gpt/image-variation`):** Generates variations of a base image or applies masks using **DALL-E 2** editing features.
- 👁️ **Extract Text from Image (`/api/gpt/extract-text-from-image`):** Upload an image and extract textual information or descriptions from it, leveraging Vision model capabilities.
- 🤖 **Financial Assistant (`/api/fa-assistant`):** OpenAI Assistants API integration for conversational AI with persistent threads and managed dialogue state.
  - `/create-thread`: Initializes a new persistent conversation thread.
  - `/user-question`: Submits a user message to the thread, processes it via the assistant (Run object), and waits to return the full conversation context.

## 🛠️ Installation and Setup

Follow these steps to deploy the development environment locally:

1. **Clone and enter the repository:**
   If you aren't inside the project folder yet, open your terminal and navigate to it:

   ```bash
   cd nest-gpt
   ```

2. **Install dependencies:**
   Run the following command to download and install all required libraries into the `node_modules` directory:

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root of the project. You must define at least your OpenAI API key in this file:

   ```env
   OPENAI_API_KEY=your_secret_api_key_here
   PORT=3000
   BASE_URL=http://localhost:3000
   ```

4. **Run the application:**
   Start the server in "watch" mode for development. This will auto-restart the project whenever you make code changes:
   ```bash
   npm run start:dev
   ```

---

And that's it! 🎉 The backend server will be up and running (usually on port 3000) locally. Your frontend application can now make requests pointing to the endpoints under the `http://localhost:3000/api/gpt/...` prefix.
