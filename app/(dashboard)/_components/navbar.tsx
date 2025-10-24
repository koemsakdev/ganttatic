import {MobileSidebar} from "@/app/(dashboard)/_components/mobile-sidebar";
import {NavbarRoute} from "@/components/navbar-route";

export const Navbar = () => {
    return (
        <div className={"p-4 border-b h-full flex items-center bg-white"}>
            <MobileSidebar />
            <NavbarRoute />
        </div>
    )
}