import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import OpenAI from 'openai'
import path from 'path'
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


