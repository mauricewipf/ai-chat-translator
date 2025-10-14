import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function ApiKeyForm({ onSubmit }) {
    const [apiKeyInput, setApiKeyInput] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const key = apiKeyInput.trim()
        if (!key) return
        onSubmit(key)
    }

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
                    <form onSubmit={handleSubmit} className="space-y-4">
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


