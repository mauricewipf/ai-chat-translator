import { ChatInterface } from '@/components/ChatInterface'
import { LanguagePairSelector } from '@/components/LanguagePairSelector'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { languages } from '@/data/languagePairs'
import OpenAI from 'openai'
import { useEffect, useMemo, useState } from 'react'

function App() {
    const [apiKey, setApiKey] = useState(() => {
        const storedKey = localStorage.getItem('openai_api_key')
        return storedKey || import.meta.env.OPENAI_API_KEY || ''
    })
    const [apiKeyInput, setApiKeyInput] = useState('')
    const [messages, setMessages] = useState([])
    // Persist only codes (pair ids) in localStorage
    const [pairIds, setPairIds] = useState(() => {
        try {
            const stored = localStorage.getItem('language_pair_ids')
            if (stored) return JSON.parse(stored)
        } catch (_) { }
        // default to some curated pairs if nothing stored
        return ['de-en', 'de-es', 'en-es', 'en-hu']
    })
    // Derive full pair objects from ids using defaultPairs as the mapping source
    const pairs = useMemo(() => {
        return (pairIds || [])
            .map((id) => {
                const [src, tgt] = id.split('-')
                const source = languages[src]
                const target = languages[tgt]
                if (!source || !target) return null
                return { id, source, target }
            })
            .filter(Boolean)
    }, [pairIds])
    const [selectedPair, setSelectedPair] = useState(() => {
        try {
            const storedIds = localStorage.getItem('language_pair_ids')
            const ids = storedIds ? JSON.parse(storedIds) : ['de-en', 'de-es', 'en-es', 'en-hu']
            const storedId = localStorage.getItem('selected_language_pair_id')
            const effectiveId = storedId && ids.includes(storedId) ? storedId : (ids[0] || null)
            if (!effectiveId) return null
            const [src, tgt] = effectiveId.split('-')
            const source = languages[src]
            const target = languages[tgt]
            return source && target ? { id: effectiveId, source, target, reversed: false } : null
        } catch (_) {
            const fallbackId = 'de-en'
            const [src, tgt] = fallbackId.split('-')
            const source = languages[src]
            const target = languages[tgt]
            return source && target ? { id: fallbackId, source, target, reversed: false } : null
        }
    })
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
        try { localStorage.setItem('selected_language_pair_id', pair.id) } catch (_) { }
    }

    useEffect(() => {
        try {
            localStorage.setItem('language_pair_ids', JSON.stringify(pairIds))
        } catch (_) { }
    }, [pairIds])

    const handleRemovePair = (id) => {
        setPairIds((prev) => {
            const next = prev.filter((pid) => pid !== id)
            setSelectedPair((prevSel) => {
                if (prevSel && prevSel.id === id) {
                    const newId = next[0]
                    if (!newId) return null
                    const [src, tgt] = newId.split('-')
                    const source = languages[src]
                    const target = languages[tgt]
                    const newSel = source && target ? { id: newId, source, target, reversed: false } : null
                    if (newSel?.id) {
                        try { localStorage.setItem('selected_language_pair_id', newSel.id) } catch (_) { }
                    }
                    return newSel
                }
                return prevSel
            })
            try { localStorage.setItem('language_pair_ids', JSON.stringify(next)) } catch (_) { }
            return next
        })
    }

    const handleApiKeySubmit = (e) => {
        e.preventDefault()
        if (apiKeyInput.trim()) {
            const key = apiKeyInput.trim()
            setApiKey(key)
            localStorage.setItem('openai_api_key', key)
        }
    }

    const getSystemPrompt = () => {
        const active = selectedPair || (pairs && pairs[0]) || null
        if (!active) return "You're a translator."
        const sourceLang = active.reversed ? active.target.name : active.source.name
        const targetLang = active.reversed ? active.source.name : active.target.name
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
                                pairs={pairs}
                                onRemovePair={handleRemovePair}
                            />
                        }
                    />
                </Card>
            </div>
        </div>
    )
}

export default App

