"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Eye, EyeOff, Loader } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/app/(auth)/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          remember: data.remember,
          onSuccess: () => {
            showToast("Success", "You have signed in successfully", "success");
            router.refresh();
            router.push("/");
          },
          onError: ({ response, error: betterError }) => {
            const serverMessage =
              betterError.error?.message ??
              betterError.message ??
              "An unexpected error occurred";
            showToast(
              response.statusText ?? betterError.statusText ?? "Error",
              serverMessage,
              "error"
            );
          },
        }
      );
    } catch (error) {
      showToast(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred",
        "error"
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 border-0 md:border rounded-xs p-6 shadow-none md:shadow-2xs bg-transparent md:bg-white md:dark:bg-gray-800", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex items-center justify-center mb-2">
                  <Image
                    src={"/ganttastic.svg"}
                    alt="Auth Logo"
                    width={200}
                    height={100}
                  />
                </div>
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your email"
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck="false"
                          className="w-full shadow-none rounded-xs focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-0 focus:ring-0 focus-visible:ring-0"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <div className={"flex items-center"}>
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href={"/forgot-password"}
                    className={
                      "ml-auto text-sm text-blue-500 underline-offset-4 hover:underline"
                    }
                  >
                    Forgot Password?
                  </Link>
                </div>
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="w-full pr-10 shadow-none rounded-xs focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-0 focus:ring-0 focus-visible:ring-0"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            disabled={isSubmitting}
                          />
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 cursor-pointer shadow-none hover:bg-transparent"
                            disabled={isSubmitting}
                          >
                            {showPassword ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-1 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={
                            "data-[state=checked]:border-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white dark:data-[state=checked]:border-purple-700 dark:data-[state=checked]:bg-purple-700 shadow-none rounded-xs focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-0 focus:ring-0 focus-visible:ring-0"
                          }
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">Remember me</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xs shadow-none bg-purple-200 hover:bg-purple-300 text-purple-600 hover:text-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 dark:text-purple-200 dark:hover:text-purple-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  "SIGN IN"
                )}
              </Button>
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-gray-50 dark:bg-gray-900 md:bg-background md:dark:bg-gray-800 text-muted-foreground relative z-10 px-2">
                Or Continue With
              </span>
            </div>
            <div className="grid gap-1 sm:grid-cols-2">
              <Button
                variant="secondary"
                type="button"
                className="w-full border border-border shadow-none rounded-xs dark:bg-gray-900 hover:bg-purple-200 hover:text-purple-500 dark:hover:bg-purple-700 dark:hover:text-purple-200"
                disabled={isSubmitting}
              >
                <FaGithub className="h-4 w-4" />
                Continue with GitHub
              </Button>

              <Button
                variant="secondary"
                type="button"
                className="w-full border border-border shadow-none rounded-xs dark:bg-gray-900 hover:bg-purple-200 hover:text-purple-500 dark:hover:bg-purple-700 dark:hover:text-purple-200"
                disabled={isSubmitting}
              >
                <FcGoogle className="h-4 w-4" />
                Continue with Google
              </Button>
            </div>

          </div>
        </form>
      </Form>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-4 hover:text-purple-600 dark:text-purple-700">
          Register
        </Link>
      </div>
    </div>
  );
}
