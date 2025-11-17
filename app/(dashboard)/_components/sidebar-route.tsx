"use client";

import {BarChart2, ChartNoAxesCombined, CircleGauge, Settings, Wrench} from "lucide-react";
import {SidebarItem} from "@/app/(dashboard)/_components/sidebar-item";

const menuRoutes = [
    {
        name: "Dashboard",
        href: "/",
        icon: CircleGauge
    },
    {
        name: "Gantt Chart",
        href: "/gantt-chart",
        icon: BarChart2
    },
    {
        name: "Reports",
        href: "/report",
        icon: ChartNoAxesCombined
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings
    },
    {
        name: "RSA Tool",
        href: "/rsa-tool",
        icon: Wrench
    }
];


export const SidebarRoute = () => {
    return (
        <div className={"flex flex-col w-full"}>
            {menuRoutes.map((route) => (
                <SidebarItem
                    key={route.href}
                    name={route.name}
                    href={route.href}
                    icon={route.icon}
                />
            ))}
        </div>
    )
}