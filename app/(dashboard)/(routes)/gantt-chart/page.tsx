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
            <div className={"flex flex-row items-center justify-between gap-2"}>
                <h1 className={"text-2xl font-bold line-clamp-1"}>
                    Gantt Chart Management
                </h1>
                <div className='flex gap-2'>
                    <Button
                        variant={"secondary"}
                        className="flex md:w-xs items-center justify-between bg-background border input-border rounded-sm px-3 text-sm text-muted-foreground dark:bg-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={searchProject}
                    >
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            <span className='hidden md:block'>Search...</span> 
                        </div>
                        <div className="hidden md:flex items-center gap-1 text-xs">
                            <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
                        </div>
                    </Button>
                    <Button onClick={createProject} variant={"secondary"} className={"bg-purple-200 hover:bg-purple-300 dark:bg-purple-800 hover:dark:bg-purple-900 text-purple-700 hover:text-purple-800 dark:text-purple-200 dark:hover:text-purple-100 rounded-sm"}>
                        <BadgePlus />
                        <span className='hidden md:block'>Create Project</span>
                    </Button>
                </div>
            </div>
            <Separator className='my-4' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2'>
                {data.map((project) => (
                    <ProjectCard key={project.title} data={project} className='border-[1px] border-purple-200 dark:border-purple-900' />
                ))}
            </div>
        </div>
    )
}

export default GanttChart