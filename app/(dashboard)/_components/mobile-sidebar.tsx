import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent, SheetHeader, SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Logo } from "@/app/(dashboard)/_components/logo";
import { SidebarRoute } from "@/app/(dashboard)/_components/sidebar-route";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
    isAuthLayout?: boolean
}

export const MobileSidebar = ({ isAuthLayout = false }: MobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className={cn(
                "lg:hidden pr-4 opacity-75 hover:opacity-55 transition-opacity duration-300",
                isAuthLayout && "!hidden"
            )}>
                <Menu />
            </SheetTrigger>
            <SheetContent side={"left"} className={"p-0 bg-white dark:bg-slate-800 overflow-y-auto"}>
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