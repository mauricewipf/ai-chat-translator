# AI Chat Translator

An AI-powered chat application for language translation built with React, shadcn/ui, and OpenAI API.

## Features

- 🌍 Multiple language pairs: German/English, German/Spanish, German/Hungarian
- 🔄 Bidirectional translation (click on selected pair to reverse direction)
- 💬 Chat-based interface for natural conversation
- 🎨 Modern UI with shadcn/ui components
- 📱 Progressive Web App (PWA) - Install and use offline
- 🔔 Auto-update notifications for new content
- 🐳 Docker support for easy deployment

## Language Pairs

- 🇩🇪 German ↔ 🇬🇧 English
- 🇩🇪 German ↔ 🇪🇸 Spanish
- 🇩🇪 German ↔ 🇭🇺 Hungarian

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

2. **Configure environment variables:**
   Copy the example environment file and add your OpenAI API key:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

### Docker Deployment

1. **Set your OpenAI API key:**
   Create a `.env` file in the root directory (not `.env.local`):
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

### Building for Production

**For production build:**
```bash
npm run build
```

**For local development build:**
```bash
npm run build:local
```

The built files will be in the `dist` directory.

> **Note**: Production builds use `.env.production` file (or environment variables if deployed), while local development uses `.env.local` file.

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

## Usage

1. **Select a language pair** by clicking on one of the language pair buttons at the bottom
2. **Toggle translation direction** by clicking on the already selected pair
3. **Type your message** in the input field
4. **Press Send** or hit Enter to get the translation

### Translation Behavior

- **Words or phrases**: Gets translated with an example sentence
- **Full sentences**: Gets translated directly

### PWA Features

The app is a Progressive Web App with the following capabilities:
- **Installable**: Install on desktop or mobile devices for quick access
- **Auto-updates**: Automatically updates when new versions are available

## Configuration

### OpenAI API

The application uses OpenAI's GPT-4 model for translations. Make sure you have:
- A valid OpenAI API key
- Sufficient API credits
- Access to GPT-4 (or modify the model in `src/App.jsx`)

### Environment Variables

The application uses a single environment variable for all environments:

- `OPENAI_API_KEY`: Your OpenAI API key

**Environment Files:**
- `.env.local` - Used for local development (not committed to git)
- `.env.production` - Used for production builds (not committed to git)
- `.env.example` - Example template (committed to git)
- `.env` - Used by Docker Compose to pass environment variables during build

Make sure to copy `.env.example` to `.env.local` for local development and set your actual API key.

## License

MIT

## Support

For issues and questions, please open an issue on the repository.

