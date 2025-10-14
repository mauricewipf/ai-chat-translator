import { ApiKeyForm } from '@/components/ApiKeyForm'
import { ChatInterface } from '@/components/ChatInterface'
import { LanguagePairSelector } from '@/components/LanguagePairSelector'
import { Card } from '@/components/ui/card'
import { languages } from '@/data/languagePairs'
import { useApiKey } from '@/hooks/useApiKey'
import { useChat } from '@/hooks/useChat'
import { useLanguagePairs } from '@/hooks/useLanguagePairs'

function App() {
    const { apiKey, saveApiKey } = useApiKey()
    const { pairs, selectedPair, onPairSelect, onRemovePair } = useLanguagePairs(languages)
    const { messages, isLoading, sendMessage } = useChat(apiKey, selectedPair)

    if (!apiKey) {
        return <ApiKeyForm onSubmit={saveApiKey} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
            <div className="max-w-4xl mx-auto h-screen flex flex-col">
                <Card className="flex-1 flex flex-col overflow-hidden">
                    <ChatInterface
                        messages={messages}
                        onSendMessage={sendMessage}
                        isLoading={isLoading}
                        languageSelector={
                            <LanguagePairSelector
                                selectedPair={selectedPair}
                                onPairSelect={onPairSelect}
                                pairs={pairs}
                                onRemovePair={onRemovePair}
                            />
                        }
                    />
                </Card>
            </div>
        </div>
    )
}

export default App

