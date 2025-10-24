import {Logo} from "@/app/(dashboard)/_components/logo";
import {SidebarRoute} from "@/app/(dashboard)/_components/sidebar-route";

export const Sidebar = () => {
    return (
        <div className={"h-full border-r flex flex-col bg-white overflow-y-auto"}>
            <div className={"p-6 w-full"}>
                <Logo />
            </div>
            <div className={"flex flex-col w-full"}>
                <SidebarRoute />
            </div>
        </div>
    )
}