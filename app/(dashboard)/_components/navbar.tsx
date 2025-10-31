import { MobileSidebar } from "@/app/(dashboard)/_components/mobile-sidebar";
import { NavbarRoute } from "@/components/navbar-route";
import { ThemeButton } from "@/components/theme-button";
import { cn } from "@/lib/utils";

interface NavbarProps {
    isAuthLayout?: boolean
}

export const Navbar = ({ isAuthLayout }: NavbarProps) => {
    return (
        <div className={cn(
            "p-4 border-b h-full flex items-center bg-white dark:bg-slate-800"
        )}>
            <MobileSidebar isAuthLayout={isAuthLayout} />
            {isAuthLayout ? (
                <div className={"flex gap-x-2 ml-auto"}>
                    <ThemeButton />
                </div>
            ) : (
                <NavbarRoute />
            )}
        </div>
    )
}