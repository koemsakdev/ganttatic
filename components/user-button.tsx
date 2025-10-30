import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";

export const UserButton = () => {
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
                    <p className="text-sm font-medium text-neutral-900"> Koemsak Mean </p>
                    <p className="text-xs font-medium text-neutral-500"> koemsak.mean@gmail.com </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                    <Settings className="size-4" />
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