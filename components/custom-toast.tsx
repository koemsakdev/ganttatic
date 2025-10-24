import React from 'react';
import {toast} from 'sonner';
import {LucideIcon, X} from 'lucide-react';
import {cn} from "@/lib/utils";

interface ToastProps {
    toastId: string | number;
    icon: LucideIcon;
    title: string;
    description: string;
    borderColor: string;
    duration: number;
    animationColor: string;
    iconColor?: string;
    bgColor: string;
}

export const CustomToast: React.FC<ToastProps> = (
    {
        toastId,
        icon: Icon,
        title,
        description,
        borderColor = "#e53e3e",
        animationColor,
        duration,
        iconColor = "#e53e3e",
        bgColor = "bg-red-100",
    }) => {
    return (
        <div
            className={`flex flex-col w-full max-w-sm rounded-sm ${bgColor} shadow-lg overflow-hidden`}>
            <div className="flex relative items-center w-full">
                <div className={`h-full w-1.5 ${borderColor} absolute left-0 top-0`}></div>
                <div className="flex flex-grow items-center space-x-4 pl-6 pr-4 py-2">
                    <div className="flex-shrink-0">
                        <Icon className={cn(
                            "h-6 w-6",
                            iconColor
                        )}/>
                    </div>
                    <div className="flex-grow">
                        <h3 className={`text-sm font-semibold ${iconColor}`}>{title}</h3>
                        <p className={`mt-1 text-sm ${iconColor} hover:opacity-75`}>{description}</p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(toastId)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                        <X className="h-5 w-5"/>
                    </button>
                </div>
            </div>
            <div className="h-1 w-full bg-gray-200 dark:bg-zinc-700">
                <div
                    className="h-full"
                    style={{
                        width: '100%',
                        animation: `toast-progress ${duration}ms linear forwards`,
                        backgroundColor: animationColor
                    }}
                ></div>
            </div>
            <style>
                {`
                  @keyframes toast-progress {
                    from {
                      width: 100%;
                    }
                    to {
                      width: 0%;
                    }
                  }
                `}
            </style>
        </div>
    );
};