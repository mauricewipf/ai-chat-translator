# AI Chat Translator

An AI-powered chat application for language translation built with React, shadcn/ui, and OpenAI API.

## Features

- 🌍 Multiple language pairs: German/English, German/Spanish, German/Hungarian
- 🔄 Bidirectional translation (click on selected pair to reverse direction)
- 💬 Chat-based interface for natural conversation
- 🎨 Modern UI with shadcn/ui components
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
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

### Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Set your OpenAI API key:**
   Create a `.env` file with:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Select a language pair** by clicking on one of the language pair buttons at the bottom
2. **Toggle translation direction** by clicking on the already selected pair
3. **Type your message** in the input field
4. **Press Send** or hit Enter to get the translation

### Translation Behavior

- **Words or phrases**: Gets translated with an example sentence
- **Full sentences**: Gets translated directly

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: OpenAI API (GPT-4)
- **Containerization**: Docker & Docker Compose

## Project Structure

```
ai-chat-translator/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── ChatInterface.jsx
│   │   └── LanguagePairSelector.jsx
│   ├── lib/
│   │   └── utils.js         # Utility functions
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── Dockerfile
├── docker-compose.yml
├── Umbrel-app.yml
├── nginx.conf
└── package.json
```

## Configuration

### OpenAI API

The application uses OpenAI's GPT-4 model for translations. Make sure you have:
- A valid OpenAI API key
- Sufficient API credits
- Access to GPT-4 (or modify the model in `src/App.jsx`)

### Environment Variables

- `VITE_OPENAI_API_KEY`: Your OpenAI API key (for local development)
- `OPENAI_API_KEY`: Your OpenAI API key (for Docker deployment)

## Development

### Adding New Language Pairs

Edit `src/components/LanguagePairSelector.jsx` and add new pairs to the `languagePairs` array:

```javascript
{
  id: 'de-fr',
  source: { code: 'de', name: 'German', flag: '🇩🇪' },
  target: { code: 'fr', name: 'French', flag: '🇫🇷' }
}
```

### Customizing the Translation Agent

Modify the `getSystemPrompt()` function in `src/App.jsx` to change the translation behavior.

## License

MIT

## Support

For issues and questions, please open an issue on the repository.

