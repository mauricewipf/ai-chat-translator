import {
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    Sidebar as SidebarRoot
} from '@/components/ui/sidebar'
import { MessageSquare } from 'lucide-react'

export function Sidebar() {
    return (
        <SidebarRoot>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2">
                    <MessageSquare className="w-5 h-5" />
                    <h2 className="font-semibold">Chat History</h2>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="text-sm text-muted-foreground p-4 text-center">
                            No chat history yet
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <div className="text-xs text-muted-foreground px-2">
                    AI Chat Translator
                </div>
            </SidebarFooter>
        </SidebarRoot>
    )
}

