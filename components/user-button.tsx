import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";

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
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal text-sm pb-0 text-purple-600">Name: Koemsak Mean</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-sm pt-0 text-purple-600">Email: koemsak.mean@gmail.com</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2 hover:bg-purple-200 hover:text-purple-600"><Settings className="hover:text-purple-600" /> Setting</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}