"use client";

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { useProjectId } from '@/features/gantt-chart/hooks/use-project-id';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

const GanttChatId = () => {
  const projectId = useProjectId();
  const router = useRouter();
  return (
    <div className='min-h-full w-full'>
      <div className={"flex flex-col md:flex-row items-center justify-between gap-2"}>
        <div className='flex h-5 items-center space-x-4 text-sm'>
          <Button variant={"ghost"} onClick={() => router.back()} className={"text-purple-700 hover:text-purple-800 rounded-xs bg-transparent hover:bg-transparent !px-0"}>
            <ArrowLeft />
            Back
          </Button>
          <Separator orientation="vertical" />
          <h1 className={"text-lg md:text-xl font-bold"}>
            Gantt Chart Management
          </h1>
        </div>
        {/* <div className='flex gap-2'>
          <Button
            variant={"secondary"}
            className="flex w-xs items-center justify-between bg-background border input-border rounded-xs px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search...</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
            </div>
          </Button>
          <Button variant={"secondary"} className={"bg-purple-200 hover:bg-purple-300 text-purple-700 hover:text-purple-800 rounded-xs"}>
            <BadgePlus />
            Create Project
          </Button>
        </div> */}
      </div>
      <Separator className='my-4' />
    </div>
  )
}

export default GanttChatId