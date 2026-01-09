"use client";

import React, { useEffect } from 'react'
import { Kbd } from "@/components/ui/kbd"
import { Button } from '@/components/ui/button'
import { FolderPlus, PlusCircle, Search } from 'lucide-react'
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
                        className="flex md:w-xs items-center justify-between bg-background border input-border rounded-xs px-3 text-sm text-muted-foreground dark:bg-accent hover:bg-accent hover:text-accent-foreground transition-colors"
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
                    <Button onClick={createProject} variant={"secondary"} className={"bg-purple-200 hover:bg-purple-300 dark:bg-purple-800 hover:dark:bg-purple-900 text-purple-700 hover:text-purple-800 dark:text-purple-200 dark:hover:text-purple-100 rounded-xs"}>
                        <PlusCircle />
                        <span className='hidden md:block'>Create Project</span>
                    </Button>
                </div>
            </div>
            <Separator className='my-4' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2'>
                {data.map((project) => (
                    <ProjectCard key={project.title} data={project} className='border-[1px] border-purple-200 dark:border-purple-900' />
                ))}

                {/* <div className='md:col-span-2 lg:col-span-3'>
                    <div className="rounded-xs shadow-none overflow-hidden p-8 animate-in fade-in zoom-in duration-300 text-center flex flex-col items-center justify-center h-[75vh]">
                        <div className="mx-auto w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-200/50 dark:ring-slate-800/50">
                            <FolderPlus className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-50 dark:text-slate-900 mb-2">
                            No projects found
                        </h3>
                        <p className="text-slate-500 text-sm mb-8 max-w-[280px] mx-auto leading-relaxed">
                            You haven't created any projects yet. Start by creating your first project to get organized.
                        </p>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default GanttChart