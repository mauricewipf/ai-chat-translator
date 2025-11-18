import { useState } from 'react'

// Use relative path for API calls (works with same server)
// Can be overridden with VITE_API_URL env var for different setups
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export function useChat(selectedPair) {
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getSystemPrompt = () => {
        const active = selectedPair
        if (!active) return "You're a translator."
        const sourceLang = active.reversed ? active.target.name : active.source.name
        const targetLang = active.reversed ? active.source.name : active.target.name
        return `You're a translator and translate from ${sourceLang} to ${targetLang}. When the prompt is a word, translate it and give an example how to use it in a full sentence. Give the example in both the source and target language. When the prompt is a full sentence or sentences, translate it and don't give an example.`
    }

    const sendMessage = async (userMessage) => {
        const newMessages = [...messages, { role: 'user', content: userMessage }]
        setMessages(newMessages)
        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: getSystemPrompt() },
                        ...newMessages
                    ],
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to get translation')
            }

            const data = await response.json()
            const assistantMessage = data.choices[0].message.content
            setMessages([...newMessages, { role: 'assistant', content: assistantMessage }])
        } catch (error) {
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: `Error: ${error.message || 'Failed to get translation. Please check the server configuration.'}`
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return { messages, isLoading, sendMessage }
}


