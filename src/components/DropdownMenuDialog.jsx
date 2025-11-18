"use client"

import { Brain, Lightbulb, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuDialog() {
    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" aria-label="Open menu" size="icon">
                        <Sparkles />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Mnemonic
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Brain className="mr-2 h-4 w-4" />
                            Explain Grammar
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
