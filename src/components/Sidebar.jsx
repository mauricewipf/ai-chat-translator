import { ModeToggle } from '@/components/mode-toggle'
import {
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    Sidebar as SidebarRoot
} from '@/components/ui/sidebar'

export function Sidebar() {
    return (
        <SidebarRoot>
            <SidebarHeader />

            <SidebarContent>
                <SidebarGroup />
                <div className="px-2 py-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <ModeToggle />
                </div>
            </SidebarContent>

            <SidebarFooter />
        </SidebarRoot>
    )
}

