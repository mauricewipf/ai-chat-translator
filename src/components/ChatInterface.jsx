import { AutoResizeTextarea } from '@/components/AutoResizeTextarea'
import { DropdownMenuDialog } from '@/components/DropdownMenuDialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Loader2, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function ChatInterface({ messages, onSendMessage, isLoading, languageSelector }) {
    const [input, setInput] = useState('')
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim() && !isLoading) {
            onSendMessage(input)
            setInput('')
        }
    }

    return (
        <div className="flex flex-col h-full relative">
            <div className="absolute top-3 left-3 z-10">
                <SidebarTrigger />
            </div>

            {/* Messages Area */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4 pt-16 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                        <p>Translate a word, text or sentence by typing below.<br /><br />
                            Click a language pair to start translating.<br /><br />
                            Click it again to toggle the direction.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-start gap-2",
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-lg px-4 py-2",
                                        message.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-foreground'
                                    )}
                                >
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <DropdownMenuDialog />
                            </div>
                        ))}
                    </div>
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                    </div>
                )}
            </ScrollArea>

            {/* Language Pair Selector - Above Input */}
            {languageSelector && (
                <div className="border-t p-3 bg-background">
                    {languageSelector}
                </div>
            )}

            {/* Input Area */}
            <div className="pb-5 px-3">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <AutoResizeTextarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your text..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}

