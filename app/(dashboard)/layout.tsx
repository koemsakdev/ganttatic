import React from "react";
import {Sidebar} from "@/app/(dashboard)/_components/sidebar";
import {Navbar} from "@/app/(dashboard)/_components/navbar";
import { CreateProjectModal } from "@/features/gantt-chart/components/create-project-modal";
import { SearchProjectCommand } from "@/features/gantt-chart/components/search-project-command";

const DashboardLayout = ({children}: {children: React.ReactNode }) => {
    return (
        <div className={"min-h-screen"}>
            <CreateProjectModal />
            <SearchProjectCommand />
            <div className={"h-16 md:pl-64 fixed insert-y-0 z-50 w-full"}>
                <Navbar />
            </div>
            <div className={"hidden md:flex h-full w-64 flex-col fixed insert-y-0 z-50"}>
                <Sidebar />
            </div>
            <main className={"md:pl-64 pt-16 h-full"}>
                <div className={"py-2.5 px-4 sm:px-6 lg:px-8"}>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout;