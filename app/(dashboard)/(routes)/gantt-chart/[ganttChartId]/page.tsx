"use client";

import { useGanttChartId } from '@/features/gantt-chart/hooks/use-gantt-chart-id';
import React from 'react'

const GanttChatId = () => {
  const ganttChartId = useGanttChartId();
  return (
    <div>
      Gantt Chart ID: {ganttChartId}
    </div>
  )
}

export default GanttChatId