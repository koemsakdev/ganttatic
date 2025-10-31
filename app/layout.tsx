import React from "react";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

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
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen p-0 m-0 antialiased bg-gray-50 dark:bg-gray-900`}>
                <NuqsAdapter>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >

                        {children}
                        <Toaster />
                    </ThemeProvider>
                </NuqsAdapter>
            </body>
        </html>
    );
}
