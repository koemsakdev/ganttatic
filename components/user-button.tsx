import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, LogOut, Moon, Palette, Settings, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const UserButton = () => {
    const router = useRouter();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={"hover:bg-transparent"} asChild={true}>
                <Avatar className={"cursor-pointer"}>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"end"}>
                <div className="flex flex-col justify-center items-center gap-2 px-2.5 py-2">
                    <Avatar className="size-12 text-xl rounded-full border border-neutral-300">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200"> Koemsak Mean </p>
                    <p className="text-xs font-medium text-neutral-500"> koemsak.mean@gmail.com </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer flex gap-2">
                        <Palette className="size-4" />
                        <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem className={cn(
                                "cursor-pointer flex justify-between dark:hover:bg-slate-900 hover:bg-gray-200",
                                currentTheme === "light" && "dark:hover:bg-slate-900 bg-gray-100 dark:bg-slate-900"
                            )}
                                onClick={() => setTheme("light")}>
                                <span className="flex gap-2"> <Sun /> Light </span>
                                {currentTheme === "light" && <BadgeCheck className="h-4 w-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem className={cn(
                                "cursor-pointer flex justify-between dark:hover:bg-slate-900 hover:bg-gray-200",
                                currentTheme === "dark" && "dark:hover:bg-slate-900 dark:bg-slate-900 bg-gray-50"
                            )}
                                onClick={() => setTheme("dark")}>
                                <span className="flex gap-2"> <Moon /> Dark </span>
                                {currentTheme === "dark" && <BadgeCheck className="h-4 w-4" />}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
                    <Settings className="size-4 text-black dark:text-white" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="size-4 text-red-500" />
                    <span className="text-red-500">Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}