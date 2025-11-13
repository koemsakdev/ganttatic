"use client";

import {UserButton} from "@/components/user-button";
import {Separator} from "@/components/ui/separator";
import {ThemeButton} from "@/components/theme-button";
export const NavbarRoute = () => {
    return (
        <div className={"flex h-5 items-center space-x-4 text-sm ml-auto"}>
            <ThemeButton />
            <Separator orientation="vertical" />
            <UserButton />
        </div>
    )
}