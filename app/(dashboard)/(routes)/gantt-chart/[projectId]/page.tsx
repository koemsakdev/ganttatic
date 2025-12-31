"use client";

import GanttPlanner from '@/components/gantt-planner';
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
      <GanttPlanner />
    </div>
  )
}

export default GanttChatId