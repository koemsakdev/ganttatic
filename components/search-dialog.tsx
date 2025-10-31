"use client"

import * as React from "react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
} from "@/components/ui/command"


interface SearchDialogProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export function SearchDialog({ children, open, onOpenChange }: SearchDialogProps) {

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange} className="shadow-none">
            <CommandInput placeholder="Type a project name or search..." />
            <CommandList className="px-0 py-2">
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
