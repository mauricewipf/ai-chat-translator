import { ChatInterface } from '@/components/ChatInterface'
import { LanguagePairSelector } from '@/components/LanguagePairSelector'
import { Card } from '@/components/ui/card'
import OpenAI from 'openai'
import { useState } from 'react'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

const openai = OPENAI_API_KEY ? new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
}) : null

function App() {
    const [selectedPair, setSelectedPair] = useState({
        id: 'de-en',
        source: { code: 'de', name: 'German', flag: '🇩🇪' },
        target: { code: 'en', name: 'English', flag: '🇬🇧' },
        reversed: false
    })
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handlePairSelect = (pair) => {
        if (selectedPair?.id === pair.id) {
            // Toggle direction if same pair is clicked
            setSelectedPair({
                ...pair,
                reversed: !selectedPair.reversed
            })
        } else {
            // Select new pair
            setSelectedPair({
                ...pair,
                reversed: false
            })
        }
    }

    const getSystemPrompt = () => {
        const sourceLang = selectedPair.reversed ? selectedPair.target.name : selectedPair.source.name
        const targetLang = selectedPair.reversed ? selectedPair.source.name : selectedPair.target.name

        return `You're a translator and translate from ${sourceLang} to ${targetLang}. When the prompt is a word or half sentence, translate it and give an example how to use it in a full sentence. When the prompt is a full sentence or sentences, translate it.`
    }

    const handleSendMessage = async (userMessage) => {
        if (!openai) {
            setMessages([...messages,
            { role: 'user', content: userMessage },
            { role: 'assistant', content: 'Error: OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.' }
            ])
            return
        }

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
            console.error('Error calling OpenAI:', error)
            setMessages([...newMessages, {
                role: 'assistant',
                content: `Error: ${error.message || 'Failed to get translation. Please check your API key and try again.'}`
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
            <div className="max-w-4xl mx-auto h-screen flex flex-col">
                <Card className="flex-1 flex flex-col overflow-hidden">
                    <ChatInterface
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        languageSelector={
                            <LanguagePairSelector
                                selectedPair={selectedPair}
                                onPairSelect={handlePairSelect}
                            />
                        }
                    />
                </Card>
            </div>
        </div>
    )
}

export default App

