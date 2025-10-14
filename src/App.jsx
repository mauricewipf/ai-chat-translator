import { ChatInterface } from '@/components/ChatInterface'
import { LanguagePairSelector } from '@/components/LanguagePairSelector'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import OpenAI from 'openai'
import { useState } from 'react'

function App() {
    const [apiKey, setApiKey] = useState(() => {
        const storedKey = sessionStorage.getItem('openai_api_key')
        return storedKey || import.meta.env.OPENAI_API_KEY || ''
    })
    const [apiKeyInput, setApiKeyInput] = useState('')
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

    const handleApiKeySubmit = (e) => {
        e.preventDefault()
        if (apiKeyInput.trim()) {
            const key = apiKeyInput.trim()
            setApiKey(key)
            sessionStorage.setItem('openai_api_key', key)
        }
    }

    const getSystemPrompt = () => {
        const sourceLang = selectedPair.reversed ? selectedPair.target.name : selectedPair.source.name
        const targetLang = selectedPair.reversed ? selectedPair.source.name : selectedPair.target.name

        return `You're a translator and translate from ${sourceLang} to ${targetLang}. When the prompt is a word or half sentence, translate it and give an example how to use it in a full sentence. When the prompt is a full sentence or sentences, translate it.`
    }

    const handleSendMessage = async (userMessage) => {
        if (!apiKey) {
            setMessages([...messages,
            { role: 'user', content: userMessage },
            { role: 'assistant', content: 'Error: OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.' }
            ])
            return
        }

        const openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        })

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

    // If no API key is set, show the API key input form
    if (!apiKey) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
                <Card className="w-full max-w-md p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-center">AI Chat Translator</h2>
                            <p className="text-sm text-muted-foreground text-center">
                                Please enter your OpenAI API key to get started
                            </p>
                        </div>
                        <form onSubmit={handleApiKeySubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="sk-..."
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    className="w-full"
                                    autoFocus
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your API key is stored locally and never sent to any server except OpenAI
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={!apiKeyInput.trim()}>
                                Continue
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        )
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

