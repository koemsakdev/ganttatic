"use client"

import * as React from "react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
} from "@/components/ui/command"
import { Kbd } from "./ui/kbd";
import { Undo, Undo2 } from "lucide-react";


interface SearchDialogProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export function SearchDialog({ children, open, onOpenChange }: SearchDialogProps) {

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange} className="px-2 shadow-none w-full !max-w-2xl bg-transparent border-0">
            <CommandInput placeholder="Type a project name or search..." />
            <CommandList className="px-0 py-2 max-h-[70vh]">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Projects" className="py-2">
                    <div className="flex flex-col gap-y-2">
                        {children}
                    </div>
                </CommandGroup>
            </CommandList>
            <CommandGroup className="mt-1 pt-1 border-t">
                <div className="px-2 py-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">Press <Kbd> <Undo2 /> ESC </Kbd> to get back.</p>
                </div>
            </CommandGroup>
        </CommandDialog>
    )
}
