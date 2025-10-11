# Environment Variable Migration Changelog

## Summary

Migrated from `VITE_OPENAI_API_KEY` to a single `OPENAI_API_KEY` environment variable across all environments (local development and production).

## Changes Made

### 1. Environment Files Created

- ✅ `.env.local` - Local development environment variables
- ✅ `.env.production` - Production environment variables  
- ✅ `.env.example` - Template file for copying

### 2. Configuration Files Updated

#### `vite.config.js`
- Added `loadEnv` import from Vite
- Configured to load environment variables based on mode
- Added `define` option to expose `OPENAI_API_KEY` to client code
- Removed need for `VITE_` prefix

#### `src/App.jsx`
- Changed `import.meta.env.VITE_OPENAI_API_KEY` to `import.meta.env.OPENAI_API_KEY`
- Updated error message to reference `OPENAI_API_KEY`

#### `package.json`
- Updated `dev` script to explicitly use `--mode development`
- Updated `build` script to explicitly use `--mode production`
- Added `build:local` script for local development builds

#### `Dockerfile`
- Added `ARG OPENAI_API_KEY` to accept build argument
- Added `ENV OPENAI_API_KEY=${OPENAI_API_KEY}` to set environment variable during build

#### `docker-compose.yml`
- Removed `environment` section (no longer needed at runtime)
- Added `args` section under `build` to pass `OPENAI_API_KEY` as build argument
- Now reads from `.env` file in root directory

#### `.gitignore`
- Added `.env.production` to ignored files

#### `README.md`
- Updated environment setup instructions
- Changed references from `VITE_OPENAI_API_KEY` to `OPENAI_API_KEY`
- Added instructions for `.env.local` and `.env.production` files
- Added documentation for different build modes

### 3. Documentation Created

- ✅ `ENVIRONMENT_SETUP.md` - Comprehensive guide for environment configuration

## Migration Instructions

### For Existing Installations

If you have an existing `.env` file with `VITE_OPENAI_API_KEY`:

1. **For local development:**
   ```bash
   # Copy your existing .env to .env.local
   cp .env .env.local
   
   # Update the variable name
   sed -i '' 's/VITE_OPENAI_API_KEY/OPENAI_API_KEY/g' .env.local
   ```

2. **For Docker deployment:**
   ```bash
   # Update your .env file
   sed -i '' 's/VITE_OPENAI_API_KEY/OPENAI_API_KEY/g' .env
   ```

3. **Rebuild the application:**
   ```bash
   # For local development
   npm run dev
   
   # For Docker
   docker-compose down
   docker-compose up -d --build
   ```

## Benefits

1. **Consistency**: Single environment variable name across all environments
2. **Clarity**: No confusion between `VITE_OPENAI_API_KEY` and `OPENAI_API_KEY`
3. **Flexibility**: Separate environment files for development and production
4. **Best Practices**: Follows standard environment variable naming conventions
5. **Better Documentation**: Clear setup instructions for different deployment scenarios

## Testing

After migration, verify the setup works:

1. **Local Development:**
   ```bash
   npm run dev
   # Navigate to http://localhost:3000
   # Try sending a translation request
   ```

2. **Production Build:**
   ```bash
   npm run build
   npm run preview
   # Navigate to http://localhost:4173
   # Try sending a translation request
   ```

3. **Docker:**
   ```bash
   docker-compose up -d
   # Navigate to http://localhost:3000
   # Try sending a translation request
   ```

## Rollback

If you need to rollback to the previous setup:

1. Change `import.meta.env.OPENAI_API_KEY` back to `import.meta.env.VITE_OPENAI_API_KEY` in `src/App.jsx`
2. Revert `vite.config.js` to not use `define` option
3. Rename your environment variable back to `VITE_OPENAI_API_KEY`
4. Restart your development server or rebuild
