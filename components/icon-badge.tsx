
import {cva, type VariantProps} from 'class-variance-authority';
import {LucideIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import React from "react";

const backgroundVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-blue-100 text-blue-500",
                secondary: "bg-gray-100 text-gray-500",
                success: "bg-green-100 text-green-500",
                warning: "bg-yellow-100 text-yellow-500",
                error: "bg-red-100 text-red-500",
            },
            size: {
                default: "size-4",
                sm: "size-3",
                lg: "size-5",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

const iconVariants = cva(
    "size-4",
    {
        variants: {
            variant: {
                default: "text-blue-500",
                secondary: "text-gray-500",
                success: "text-green-500",
                warning: "text-yellow-500",
                error: "text-red-500",
            },
            size: {
                default: "size-4",
                sm: "size-3",
                lg: "size-5",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps, React.HTMLAttributes<HTMLDivElement> {
    icon: LucideIcon
}

export const IconBadge = ({icon: Icon, variant, size, className}: IconBadgeProps) => {
    return (
        <div className={cn(
            backgroundVariants({variant, size}),
            className
        )}>
            <Icon className={cn(
                iconVariants({variant, size}),
                className
            )}/>
        </div>
    )
}