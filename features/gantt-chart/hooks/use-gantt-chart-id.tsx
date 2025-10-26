import { useParams } from "next/navigation"

export const useGanttChartId = () => {
    const params = useParams();
    return params.ganttChartId as string;
}