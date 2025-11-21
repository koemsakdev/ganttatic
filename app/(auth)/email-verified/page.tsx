"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

export default function EmailVerifiedPage() {
  const router = useRouter();
  const { 
    data: session, 
    isPending
  } = authClient.useSession();

  if (isPending) {
    return (
      <Loading />
    )
  }

  if (!session) {
    router.push('/sign-in');
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center bg-transparent md:bg-white md:dark:bg-slate-800 border-none shadow-none">
        <CardHeader className="flex flex-col items-center space-y-6 pb-2">
          <div className="rounded-full animate-in zoom-in-50 duration-300">
             <Image src={'/check-mail.png'} alt="verified" width={75} height={75} /> 
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Account Activated
            </CardTitle>
            <CardDescription className="text-base">
              Hello <strong className="text-green-600">{session?.user.name}</strong>,
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you, your email has been verified. Your account now is active. Please use the below link to login into your account.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-4">
          <Button
            asChild
            className="w-full gap-2 bg-green-500 hover:bg-green-600 dark:bg-green-800 hover:dark:bg-green-900 text-white"
            size="lg"
          >
            <Link href="/sign-in">
              LOGIN INTO YOUR ACCOUNT
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}