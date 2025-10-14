import OpenAI from 'openai'
import { useState } from 'react'

export function useChat(apiKey, selectedPair) {
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getSystemPrompt = () => {
        const active = selectedPair
        if (!active) return "You're a translator."
        const sourceLang = active.reversed ? active.target.name : active.source.name
        const targetLang = active.reversed ? active.source.name : active.target.name
        return `You're a translator and translate from ${sourceLang} to ${targetLang}. When the prompt is a word or half sentence, translate it and give an example how to use it in a full sentence. When the prompt is a full sentence or sentences, translate it.`
    }

    const sendMessage = async (userMessage) => {
        if (!apiKey) {
            setMessages((prev) => [
                ...prev,
                { role: 'user', content: userMessage },
                { role: 'assistant', content: 'Error: OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.' }
            ])
            return
        }

        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

        const newMessages = [...messages, { role: 'user', content: userMessage }]
        setMessages(newMessages)
        setIsLoading(true)

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: getSystemPrompt() },
                    ...newMessages
                ],
            })
            const assistantMessage = response.choices[0].message.content
            setMessages([...newMessages, { role: 'assistant', content: assistantMessage }])
        } catch (error) {
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: `Error: ${error.message || 'Failed to get translation. Please check your API key and try again.'}`
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return { messages, isLoading, sendMessage }
}


