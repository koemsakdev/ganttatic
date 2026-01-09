"use client";
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

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
    const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
    const handleRedirect = () => {
        setIsRedirecting(true);
        router.push(`/gantt-chart/${data.id}`);
    }
    if (isRedirecting) return <Loading />;
    return (
        <Card className={cn(
            className,
            'w-full gap-y-2 cursor-pointer hover:bg-slate-50 hover:border-purple-400 dark:hover:border-purple-800 dark:hover:bg-gray-900 transition-all duration-400 ease-in-out rounded-xs'
        )}
            onClick={handleRedirect}
        >
            <CardHeader>
                <CardTitle>{data.title}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2 text-sm text-slate-800 dark:text-slate-300">
                    <CalendarDays className='size-4'/>
                    <span className="font-medium mt-0.5">
                        {data.startDate} - {data.endDate}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectCard