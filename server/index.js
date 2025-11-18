import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import OpenAI from 'openai'
import path from 'path'
import { createClient } from 'redis'
import { fileURLToPath } from 'url'

// Load environment variables from .env file
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// Validate API key on startup
if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set')
    console.error('Please create a .env file in the server directory with your API key')
    process.exit(1)
}

// Initialize Redis client
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const DEFAULT_PAIR_IDS = ['de-hu', 'de-en', 'de-es', 'en-es', 'en-hu']
const PAIRS_KEY = 'language_pair_ids'

const redis = createClient({
    url: REDIS_URL
})

redis.on('error', (err) => console.error('Redis Client Error:', err))
redis.on('connect', () => console.log('Redis Client Connected'))

// Connect to Redis and initialize default data
async function initializeRedis() {
    try {
        await redis.connect()

        // Check if language pairs exist in Redis, if not initialize with defaults
        const existingPairs = await redis.get(PAIRS_KEY)
        if (!existingPairs) {
            await redis.set(PAIRS_KEY, JSON.stringify(DEFAULT_PAIR_IDS))
            console.log('Initialized Redis with default language pairs:', DEFAULT_PAIR_IDS)
        } else {
            console.log('Redis already contains language pairs:', JSON.parse(existingPairs))
        }
    } catch (error) {
        console.error('Failed to connect to Redis:', error)
        console.log('Continuing without Redis - data will not persist')
    }
}

// Initialize Redis on startup
await initializeRedis()

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files from the frontend build directory
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Language pairs endpoints
app.get('/api/language-pairs', async (req, res) => {
    try {
        if (!redis.isOpen) {
            return res.status(503).json({ error: 'Redis is not connected' })
        }
        const pairs = await redis.get(PAIRS_KEY)
        res.json({ pairIds: pairs ? JSON.parse(pairs) : DEFAULT_PAIR_IDS })
    } catch (error) {
        console.error('Error fetching language pairs:', error)
        res.status(500).json({ error: 'Failed to fetch language pairs' })
    }
})

app.post('/api/language-pairs', async (req, res) => {
    try {
        if (!redis.isOpen) {
            return res.status(503).json({ error: 'Redis is not connected' })
        }
        const { pairIds } = req.body
        if (!Array.isArray(pairIds)) {
            return res.status(400).json({ error: 'pairIds must be an array' })
        }
        await redis.set(PAIRS_KEY, JSON.stringify(pairIds))
        res.json({ success: true, pairIds })
    } catch (error) {
        console.error('Error saving language pairs:', error)
        res.status(500).json({ error: 'Failed to save language pairs' })
    }
})

// OpenAI proxy endpoint
app.post('/api/chat/completions', async (req, res) => {
    try {
        const { messages, model = 'gpt-4' } = req.body

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                error: 'Messages array is required'
            })
        }

        const response = await openai.chat.completions.create({
            model,
            messages,
        })

        res.json(response)
    } catch (error) {
        console.error('OpenAI API Error:', error)
        res.status(error.status || 500).json({
            error: error.message || 'Failed to process request'
        })
    }
})

// Serve index.html for all non-API routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Serving frontend from ${distPath}`)
})


