import { ChatInterface } from '@/components/ChatInterface'
import { LanguagePairSelector } from '@/components/LanguagePairSelector'
import { Card } from '@/components/ui/card'
import { useChat } from '@/hooks/useChat'
import { useLanguagePairs } from '@/hooks/useLanguagePairs'
import { languages } from '@/lib/languages'

function App() {
    const { pairs, selectedPair, onPairSelect, onRemovePair, onAddPair } = useLanguagePairs(languages)
    const { messages, isLoading, sendMessage } = useChat(selectedPair)

    return (
        <div className="h-dvh bg-gradient-to-br from-background to-secondary">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
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
                                onAddPair={onAddPair}
                                languages={languages}
                            />
                        }
                    />
                </Card>
            </div>
        </div>
    )
}

export default App

