"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verify = async () => {
            try {
                await axios.post("/api/auth/verify-email", { token });
                setStatus("success");
                setMessage("Your email has been verified. You can now log in.");
            } catch (error) {
                setStatus("error");
                setMessage("Verification failed or link expired.");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[400px]">
                <CardHeader className="text-center">
                    <CardTitle>Email Verification</CardTitle>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                    {status === "loading" && (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <p>Verifying…</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center gap-2">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                            <p>{message}</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center gap-2">
                            <XCircle className="h-10 w-10 text-red-500" />
                            <p>{message}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
