import React from "react";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: "Ganttatic",
    description: "Ganttatic is a project management tool that helps you to create and manage your projects.",
    icons: "/favicon.svg"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`antialiased`}
            > <NuqsAdapter>

                    {children}
                    <Toaster />
                </NuqsAdapter>
            </body>
        </html>
    );
}
