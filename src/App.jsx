import { ChatInterface } from '@/components/ChatInterface'
import { LanguagePairSelector } from '@/components/LanguagePairSelector'
import { Sidebar } from '@/components/Sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useChat } from '@/hooks/useChat'
import { useLanguagePairs } from '@/hooks/useLanguagePairs'
import { languages } from '@/lib/languages'

function App() {
    const { pairs, selectedPair, onPairSelect, onRemovePair, onAddPair } = useLanguagePairs(languages)
    const { messages, isLoading, sendMessage } = useChat(selectedPair)

    return (
        <SidebarProvider defaultOpen={false}>
            <div
                className="bg-gradient-to-br from-background to-secondary w-full"
                style={{
                    height: '100dvh',
                    paddingTop: 'max(env(safe-area-inset-top), 0px)',
                    //paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
                    paddingLeft: 'env(safe-area-inset-left)',
                    paddingRight: 'env(safe-area-inset-right)',
                    boxSizing: 'border-box',
                }}
            >
                <div className="h-full w-full flex relative">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <SidebarInset className="flex-1 flex flex-col w-full overflow-hidden">
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
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default App

