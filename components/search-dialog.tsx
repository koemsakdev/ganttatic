"use client"

import * as React from "react"
import {
    Calculator,
    Calendar,
    Smile,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"


interface SearchDialogProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export function SearchDialog({ children, open, onOpenChange }: SearchDialogProps) {

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange} className="rounded-[4px] shadow-none w-full">
            <CommandInput placeholder="Type a project name or search..." />
            <CommandList className="p-0">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup className="py-2">
                    <div className="flex flex-col gap-y-2">
                        {children}
                    </div>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
