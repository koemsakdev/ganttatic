import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent, SheetDescription, SheetHeader, SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {Sidebar} from "@/app/(dashboard)/_components/sidebar";
import {Logo} from "@/app/(dashboard)/_components/logo";
import {SidebarRoute} from "@/app/(dashboard)/_components/sidebar-route";

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className={"md:hidden pr-4 opacity-75 hover:opacity-55 transition-opacity duration-300"}>
                <Menu />
            </SheetTrigger>
            <SheetContent side={"left"} className={"p-0 bg-white"}>
                <SheetHeader>
                    <SheetTitle>
                        <div className={"p-0 pl-2 w-full"}>
                            <Logo />
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <div className={"flex flex-col w-full"}>
                    <SidebarRoute />
                </div>
            </SheetContent>
        </Sheet>
    )
}