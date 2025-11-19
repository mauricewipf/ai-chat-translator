import { ModeToggle } from '@/components/mode-toggle'
import {
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    Sidebar as SidebarRoot
} from '@/components/ui/sidebar'

export function Sidebar() {
    return (
        <SidebarRoot>
            <SidebarHeader />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="px-2 py-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Theme</span>
                            <ModeToggle />
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter />
        </SidebarRoot>
    )
}

