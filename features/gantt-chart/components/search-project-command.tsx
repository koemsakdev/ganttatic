"use client";

import { useSearchProjectCommand } from "../hooks/use-search-project-command";
import { SearchDialog } from "@/components/search-dialog";
import ProjectCard from "./project-cart";
import { CommandItem } from "@/components/ui/command";

export const SearchProjectCommand = () => {
    const { isOpen, setIsOpen } = useSearchProjectCommand();

    const eventData = [
        {
            title: "Project Launch Kickoff",
            description: "Final planning session and feature-freeze meeting for the Q4 product release.",
            startDate: "Oct 28, 2025",
            endDate: "Oct 30, 2025",
        },
        {
            title: "Product Launch",
            description: "Ongoing product launch event with a focus on customer feedback and post-launch support.",
            startDate: "Nov 1, 2025",
            endDate: "Nov 3, 2025",
        },
        {
            title: "Customer Feedback Session",
            description: "Regular session to gather customer feedback and address any concerns.",
            startDate: "Nov 5, 2025",
            endDate: "Nov 7, 2025",
        },
        {
            title: "Post-Launch Support Session",
            description: "Ongoing support session to address customer concerns and provide post-launch guidance.",
            startDate: "Nov 10, 2025",
            endDate: "Nov 12, 2025",
        },
        {
            title: "Customer Support Session",
            description: "Ongoing support session to address customer concerns and provide post-launch guidance.",
            startDate: "Nov 15, 2025",
            endDate: "Nov 17, 2025",
        },
    ];
    return (
        <SearchDialog open={isOpen} onOpenChange={setIsOpen}>
            {eventData.map((item) => (
                <CommandItem key={item.title} className="!p-0 rounded-xs border-[1px]">
                    <ProjectCard data={item} />
                </CommandItem>
            ))}
        </SearchDialog>
    )
}
