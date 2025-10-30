import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
    data: {
        id: string,
        title: string,
        description?: string,
        startDate: string,
        endDate: string
    },
    className?: string
}

const ProjectCard = ({ data, className }: ProjectCardProps) => {
    const router = useRouter();
    return (
        <Card className={cn(
            className,
            'w-full shadow-none rounded-xs gap-y-2 cursor-pointer hover:bg-slate-50 hover:border-purple-400'
        )}
            onClick={() => router.push(`/gantt-chart/${data.id}`)}
        >
            <CardHeader>
                <CardTitle>{data.title}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CalendarClock />
                    <span className="font-medium text-foreground">
                        {data.startDate} - {data.endDate}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectCard