# Environment Setup Guide

This document explains how to configure environment variables for local development and production builds.

## Environment Variables

The application uses a single environment variable across all environments:

- `OPENAI_API_KEY` - Your OpenAI API key

## Environment Files

### `.env.example`
- **Purpose**: Template file showing required environment variables
- **Committed to git**: ✅ Yes
- **Usage**: Copy this to create your local environment file

### `.env.local`
- **Purpose**: Local development environment variables
- **Committed to git**: ❌ No (ignored)
- **Usage**: Used when running `npm run dev` or `npm run build:local`

### `.env.production`
- **Purpose**: Production environment variables
- **Committed to git**: ❌ No (ignored)
- **Usage**: Used when running `npm run build`

### `.env`
- **Purpose**: Docker Compose environment variables
- **Committed to git**: ❌ No (ignored)
- **Usage**: Used by Docker Compose to pass build arguments

## Setup Instructions

### For Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### For Production Build (without Docker)

1. Create or edit `.env.production`:
   ```bash
   cp .env.example .env.production
   ```

2. Add your production OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-production-api-key-here
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### For Docker Deployment

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

## How It Works

### Vite Configuration

The `vite.config.js` is configured to:
- Load environment variables based on the mode (development/production)
- Expose `OPENAI_API_KEY` to the client code via `import.meta.env.OPENAI_API_KEY`
- Support non-VITE_ prefixed environment variables

### Build Scripts

- `npm run dev` - Runs development server in `development` mode (uses `.env.local`)
- `npm run build` - Builds for production in `production` mode (uses `.env.production`)
- `npm run build:local` - Builds with development config (uses `.env.local`)

### Docker Build

The Dockerfile:
- Accepts `OPENAI_API_KEY` as a build argument
- Sets it as an environment variable during the build process
- Bakes the API key into the static build files

Docker Compose:
- Reads `OPENAI_API_KEY` from the `.env` file
- Passes it as a build argument to the Dockerfile

## Security Notes

⚠️ **Important**: 
- Never commit `.env`, `.env.local`, or `.env.production` files with real API keys
- The API key is embedded in the built JavaScript files (client-side)
- For production deployments, consider using a backend proxy to secure your API key
- The current setup uses `dangerouslyAllowBrowser: true` in the OpenAI client, which is suitable for development but not recommended for production

## Troubleshooting

### API Key Not Found

If you see "Error: OpenAI API key not configured" in the application:

1. Verify the correct environment file exists:
   - For `npm run dev`: Check `.env.local`
   - For `npm run build`: Check `.env.production`
   - For Docker: Check `.env` in the root directory

2. Verify the key is set correctly:
   ```bash
   cat .env.local  # or .env.production or .env
   ```

3. Restart the development server or rebuild the application

### Environment File Not Loading

1. Make sure you're using the correct npm script:
   - `npm run dev` for development
   - `npm run build` for production

2. Check that the file is in the root directory of the project

3. Verify there are no syntax errors in the environment file

