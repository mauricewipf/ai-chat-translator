import { ChatInterface } from '@/components/ChatInterface'
import { LanguagePairSelector } from '@/components/LanguagePairSelector'
import { Sidebar } from '@/components/Sidebar'
import { Card } from '@/components/ui/card'
import { useChat } from '@/hooks/useChat'
import { useLanguagePairs } from '@/hooks/useLanguagePairs'
import { languages } from '@/lib/languages'
import { useState } from 'react'

function App() {
    const { pairs, selectedPair, onPairSelect, onRemovePair, onAddPair } = useLanguagePairs(languages)
    const { messages, isLoading, sendMessage } = useChat(selectedPair)
    // Sidebar closed by default on mobile, open on desktop
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div
            className="bg-gradient-to-br from-background to-secondary"
            style={{
                height: '100dvh',
                paddingTop: 'max(env(safe-area-inset-top), 0px)',
                //paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
                paddingLeft: 'env(safe-area-inset-left)',
                paddingRight: 'env(safe-area-inset-right)',
                boxSizing: 'border-box',
            }}
        >
            <div className="h-full flex md:gap-4 md:p-4 relative">
                {/* Backdrop overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <Card className="flex-1 flex flex-col overflow-hidden md:rounded-lg rounded-none">
                        <ChatInterface
                            messages={messages}
                            onSendMessage={sendMessage}
                            isLoading={isLoading}
                            isSidebarOpen={isSidebarOpen}
                            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
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
        </div>
    )
}

export default App

