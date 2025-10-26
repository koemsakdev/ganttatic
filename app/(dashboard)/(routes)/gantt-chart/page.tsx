"use client";

import React, { useEffect } from 'react'
import { Kbd } from "@/components/ui/kbd"
import { Button } from '@/components/ui/button'
import { BadgePlus, Search } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useCreateProjectModal } from '@/features/gantt-chart/hooks/use-create-project-modal'
import { useSearchProjectCommand } from '@/features/gantt-chart/hooks/use-search-project-command';
import { eventData } from '@/data/fake-project';
import ProjectCard from '@/features/gantt-chart/components/project-cart';

const GanttChart = () => {
    const { open: createProject } = useCreateProjectModal();
    const { open: searchProject, setIsOpen: setIsProjectOpen } = useSearchProjectCommand();
    const data = eventData;

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" || e.key == "K") && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsProjectOpen((searchProject) => !searchProject)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [setIsProjectOpen])

    return (
        <div className='w-full h-full'>
            <div className={"flex flex-col md:flex-row items-center justify-between gap-2"}>
                <h1 className={"text-2xl font-bold"}>
                    Gantt Chart Management
                </h1>
                <div className='flex gap-2'>
                    <Button
                        variant={"secondary"}
                        className="flex w-xs items-center justify-between bg-background border input-border rounded-xs px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={searchProject}
                    >
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            <span>Search...</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                            <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
                        </div>
                    </Button>
                    <Button onClick={createProject} variant={"secondary"} className={"bg-purple-200 hover:bg-purple-300 text-purple-700 hover:text-purple-800 rounded-xs"}>
                        <BadgePlus />
                        Create Project
                    </Button>
                </div>
            </div>
            <Separator className='my-4' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
                {data.map((project) => (
                    <ProjectCard key={project.title} data={project} className='border-[1px] border-purple-200' />
                ))}
            </div>

        </div>
    )
}

export default GanttChart