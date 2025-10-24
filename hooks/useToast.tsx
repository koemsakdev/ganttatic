import React from "react";
import { toast } from "sonner";
import {CustomToast} from "@/components/custom-toast";
import {AlertTriangle, CheckCircle2, LucideIcon, XCircle, Info} from "lucide-react";

type ToastStatus = 'success' | 'error' | 'warning' | 'info';

export const useToast = () => {
    const showToast = (title: string, description: string, status: ToastStatus) => {
        let icon: LucideIcon;
        let borderColor: string;
        let animationColor: string;
        let duration = 3000;
        let iconColor: string;
        let bgColor: string;

        switch (status) {
            case 'success':
                icon = CheckCircle2;
                borderColor = "bg-green-500";
                animationColor = "#22C55E";
                iconColor = "text-green-500";
                bgColor = "bg-green-100";
                break;
            case 'error':
                icon = XCircle;
                borderColor = "bg-red-500";
                animationColor = "#EF4444";
                iconColor = "text-red-500";
                bgColor = "bg-red-100";
                break;
            case 'warning':
                icon = AlertTriangle;
                borderColor = "bg-orange-500";
                animationColor = "#ea6608";
                iconColor = "text-orange-500";
                bgColor = "bg-orange-100";
                break;
            case 'info':
                icon = Info;
                borderColor = "bg-blue-500";
                animationColor = "#3B82F6";
                iconColor = "text-blue-500";
                bgColor = "bg-blue-100";
                break;
            default:
                return;
        }

        toast.custom((t) => (
            <CustomToast
                toastId={t}
                icon={icon}
                title={title}
                description={description}
                borderColor={borderColor}
                animationColor={animationColor}
                duration={duration}
                iconColor={iconColor}
                bgColor={bgColor}
            />
        ), { duration });
    };
    return { showToast };
};