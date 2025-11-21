"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function VerifyEmailAlertPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md text-center bg-transparance md:bg-white md:dark:bg-slate-800 border-none shadow-none">
                <CardHeader className="flex flex-col items-center space-y-6 pb-2">
                    <div className="rounded-full animate-in zoom-in-50 duration-300">
                        <Image src={'/communications.png'} alt="verification-email" width={75} height={75} />
                    </div>

                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Check your inbox
                        </CardTitle>
                        <CardDescription className="text-base">
                            You&apos;re almost there! We&apos;ve sent a verification link to an email <strong>koemsak.mean@gmail.com</strong>.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed bg-blue-500/20 p-4 rounded-md border border-blue-500/10">
                        Just click on the button or copy the link that we&apos;ve send to your email to complete your sign up. If you don&apos;t see it, you may need to  <strong className="text-blue-500">check your spam</strong> folder.
                    </p>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pt-2">
                    {/* Primary Action: Go back to login page */}
                    <Button asChild className="w-full gap-2 bg-blue-400 hover:bg-blue-500 dark:bg-blue-800 hover:dark:bg-blue-900 text-white" size="lg">
                        <Link href="/sign-in">
                            Return to Sign In
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}