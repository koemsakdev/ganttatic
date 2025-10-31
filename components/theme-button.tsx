"use client"

import * as React from "react"
import { BadgeCheck, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeButton() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="focus-visible:outline-0 focus-visible:shadow-none focus:shadow-none rounded-full">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-slate-800">
                <DropdownMenuItem
                    className={cn(
                        "cursor-pointer flex justify-between dark:hover:bg-slate-900 hover:bg-gray-200",
                        currentTheme === "light" && "dark:hover:bg-slate-900 bg-gray-100 dark:bg-slate-900"
                    )}
                    onClick={() => setTheme("light")}
                >
                    <span className="flex gap-2"> <Sun /> Light </span>
                    {currentTheme === "light" && <BadgeCheck className="h-4 w-4" />}
                </DropdownMenuItem>

                <DropdownMenuItem
                    className={cn(
                        "cursor-pointer flex justify-between dark:hover:bg-slate-900 hover:bg-gray-200",
                        currentTheme === "dark" && "dark:hover:bg-slate-900 dark:bg-slate-900 bg-gray-50"
                    )}
                    onClick={() => setTheme("dark")}
                >
                    <span className="flex gap-2"> <Moon /> Dark </span>
                    {currentTheme === "dark" && <BadgeCheck className="h-4 w-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
