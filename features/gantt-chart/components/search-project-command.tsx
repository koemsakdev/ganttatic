"use client";

import { useSearchProjectCommand } from "../hooks/use-search-project-command";
import { SearchDialog } from "@/components/search-dialog";
import ProjectCard from "./project-cart";
import { CommandItem } from "@/components/ui/command";
import { eventData } from "@/data/fake-project";

export const SearchProjectCommand = () => {
    const { isOpen, setIsOpen } = useSearchProjectCommand();
    return (
        <SearchDialog open={isOpen} onOpenChange={setIsOpen}>
            {eventData.map((item) => (
                <CommandItem key={item.id} className="!p-0 min-h-[100%]">
                    <ProjectCard data={item} />
                </CommandItem>
            ))}
        </SearchDialog>
    )
}
