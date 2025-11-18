import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'

export function Sidebar({ isOpen, onToggle }) {
    return (
        <Card
            className={cn(
                "h-full flex flex-col transition-all duration-300 ease-in-out",
                // Mobile: fixed overlay sidebar
                "fixed left-0 top-0 z-50 md:relative md:z-0",
                "rounded-none md:rounded-lg",
                // Visibility
                isOpen
                    ? "w-64 md:w-64"
                    : "w-0 overflow-hidden opacity-0 md:w-0"
            )}
        >
            <div className="p-4 border-b flex items-center">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <h2 className="font-semibold">Chat History</h2>
                </div>
            </div>

            <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                    {/* Placeholder for future chat history */}
                    <div className="text-sm text-muted-foreground p-4 text-center">
                        No chat history yet
                    </div>
                </div>
            </ScrollArea>

            <div className="p-4 border-t">
                <div className="text-xs text-muted-foreground">
                    AI Chat Translator
                </div>
            </div>
        </Card>
    )
}

