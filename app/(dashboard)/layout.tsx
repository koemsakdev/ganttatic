import React from "react";
import {Sidebar} from "@/app/(dashboard)/_components/sidebar";
import {Navbar} from "@/app/(dashboard)/_components/navbar";
import { CreateProjectModal } from "@/features/gantt-chart/components/create-project-modal";
import { SearchProjectCommand } from "@/features/gantt-chart/components/search-project-command";
import {ThemeButton} from "@/components/theme-button";

const DashboardLayout = ({children}: {children: React.ReactNode }) => {
    return (
        <div className={"min-h-screen"}>
            <CreateProjectModal />
            <SearchProjectCommand />
            <div className={"h-16 lg:pl-64 fixed insert-y-0 z-50 w-full"}>
                <Navbar />
            </div>
            <div className={"hidden lg:flex h-full w-64 flex-col fixed insert-y-0 z-50"}>
                <Sidebar />
            </div>
            <main className={"lg:pl-64 pt-16 h-full"}>
                <div className={"p-4 sm:p-6 lg:p-4"}>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout;