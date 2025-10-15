# AI Chat Translator

An AI-powered chat application for language translation built with React, shadcn/ui, and OpenAI API.

> https://ai-chat-translator.vercel.app/

## Features

- 🌍 Translate word and sentences. Get exmaples on how to use a word
- 🔄 Bidirectional translation (click on selected pair to reverse direction)
- 💬 Chat-based interface for natural conversation
- 🎨 Modern UI with shadcn/ui components
- 📱 Progressive Web App (PWA)
- 🐳 Docker support for easy deployment
- 🔒 Secure server-side API key management

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Docker and Docker Compose (for containerized deployment)

## Setup

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your OpenAI API key:**
   Create a `.env` file in the `server` directory:
   ```bash
   cd server
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

3. **Start the application:**

   **For production-like environment (unified server):**
   ```bash
   npm start
   ```
   Access at `http://localhost:3001`

   **For development with hot-reload:**
   ```bash
   npm run dev:all
   ```
   Access at `http://localhost:3000`

### Building for Production

**For production build:**
```bash
npm run build
```

**For local development build:**
```bash
npm run build:local
```

The built files will be in the `dist` directory and served by the Express server.

## Publishing to Docker Hub

1. **Log in to Docker Hub:**

        docker login

2. **Build, tag and push with your Docker Hub username:**

         # Use BuildKit for multi-arch builds
         docker buildx create --use

         docker buildx build \
            --platform linux/amd64,linux/arm64 \
            -t mauricewipf/ai-chat-translator:latest \
            -t mauricewipf/ai-chat-translator:0.1.1 \
            --build-arg GIT_REVISION=$(git rev-parse --short HEAD) \
            --build-arg APP_VERSION=0.1.1 \
            --push \
            --provenance=false \
            .

3. Others can then pull and use your image:

         docker pull mauricewipf/ai-chat-translator:latest

View on Docker Hub: https://hub.docker.com/repository/docker/mauricewipf/ai-chat-translator

4. How to use the image

         docker run \
            --publish 3000:80 \
            --restart unless-stopped \
            --env OPENAI_API_KEY=YOUR_SECRET_KEY_BASE \
            mauricewipf/ai-chat-translator:latest

## Docker Deployment

1. **Set your OpenAI API key:**
   Create a `.env` file in the `server` directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3001`

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmauricewipf%2Fai-chat-translator&project-name=ai-chat-translator&repository-name=ai-chat-translator)

## License

MIT

## Support

For issues and questions, please open an issue on the repository.

