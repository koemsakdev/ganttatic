"use client";

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { profileSchema } from '@/features/settings/schema'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BadgeCheckIcon, Eye, EyeOff, ImageIcon, Laptop, Loader, TriangleAlert, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge';
import { linkedAccounts } from '@/data/fake-account-linked';
import { activeSessions } from '@/data/fake-sessions';

const SettingPage = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      image: undefined,
    }
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    console.table(values);
  }

  const onHandleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      form.setValue('image', file)
    }
  }


  return (
    <div className='w-full h-full'>

      <h1 className={"text-lg md:text-2xl font-bold"}>
        Account Settings
      </h1>
      <p className={"text-sm text-muted-foreground"}>
        Manage your account settings and preferences.
      </p>
      <Separator className='my-4' />
      <div className='grid gap-4'>
        <Card className='shadow-none border border-border bg-white dark:bg-gray-900'>
          <CardHeader>
            <CardTitle className='text-lg md:text-2xl'>Personal information</CardTitle>
            <CardDescription>
              Manage your public profile information.
            </CardDescription>
          </CardHeader>
          <Separator className='my-2' />
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-4">
                  <p className="text-base">Profile Image</p>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <div className="flex flex-col gap-y-2">
                        <div className={cn(
                          "flex flex-col gap-5"
                        )}>
                          {
                            field.value ? (
                              <div className={cn(
                                "size-[170px] relative rounded-xs overflow-hidden",
                                "border-2 border-dashed cursor-pointer transition-colors",
                                "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-800"
                              )}>
                                <Image
                                  src={
                                    field.value instanceof File ? URL.createObjectURL(field.value) : field.value
                                  }
                                  alt="profile image"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <Avatar className={cn(
                                "size-[170px] rounded-xs",
                                "border-2 border-dashed cursor-pointer transition-colors",
                                "hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-700",
                                "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-800",
                                isDragOver && 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              )}
                                onClick={() => inputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                              >
                                <AvatarFallback className="rounded-md">
                                  <Upload className="size-[32px] text-purple-500" />
                                </AvatarFallback>
                              </Avatar>
                            )
                          }
                          <div className="flex flex-col">
                            <p className="text-sm text-muted-foreground">Accept only</p>
                            <p className="text-sm text-muted-foreground">
                              .png, .jpg, .jpeg, or .svg, max 1MB
                            </p>
                            <Input
                              type="file"
                              accept="image/png, image/jpeg, image/webp, image/svg+xml"
                              className="hidden"
                              ref={inputRef}
                              onChange={onHandleImageChange}
                            />
                            {
                              !field.value ? (
                                <Button
                                  variant={"secondary"}
                                  type="button"
                                  size={"sm"}
                                  className="w-fit rounded-xs mt-2 bg-purple-100 hover:bg-purple-200 text-purple-600 hover:text-purple-700"
                                  onClick={() => inputRef.current?.click()}
                                >
                                  <Upload /> Upload a Profile
                                </Button>
                              ) : (
                                <Button
                                  variant={"secondary"}
                                  type="button"
                                  size={"sm"}
                                  className="w-fit mt-2 text-red-400 hover:text-red-500"
                                  onClick={() => {
                                    field.onChange(null);
                                    if (inputRef.current) inputRef.current.value = "";
                                  }}
                                >
                                  <X /> Remove
                                </Button>
                              )
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  />
                  <Separator className='my-2' />
                  <div className="grid lg:grid-cols-2 gap-3">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="firstName">First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Enter first name"
                                className="w-full rounded-xs shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="lastName">Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Enter first name"
                                className="w-full rounded-xs shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter email"
                              className="w-full rounded-xs shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                              autoComplete="off"
                              value={"koemsak.mean@gmail.com"}
                              disabled={true}
                            />
                            <div className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition-opacity'>
                              <Badge
                                variant="secondary"
                                className="bg-green-500 text-white dark:bg-green-600"
                              >
                                <BadgeCheckIcon />
                                Verified
                              </Badge>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator className='my-2' />
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
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
                              />
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 cursor-pointer shadow-none hover:bg-transparent"
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
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <FormField
                      name="confirmPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                className="w-full pr-10 shadow-none rounded-xs focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-0 focus:ring-0 focus-visible:ring-0"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Enter your confirm password"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                              />
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 cursor-pointer shadow-none hover:bg-transparent"
                              >
                                {showConfirmPassword ? (
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
                  <Button
                    type="submit"
                    className="w-fit rounded-xs px-8 shadow-none bg-purple-500 hover:bg-purple-600 text-white"
                    size={"sm"}
                  >
                    {
                      isSubmitting ? (
                        <div className="flex items-center">
                          <Loader size={4} className="animate-spin" />
                        </div>
                      ) : (
                        "Save"
                      )
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className='shadow-none border border-border bg-white dark:bg-gray-900'>
          <CardHeader>
            <CardTitle className='text-lg md:text-2xl'>Change Password</CardTitle>
            <CardDescription>
              Change your password.
            </CardDescription>
          </CardHeader>
          <Separator className='my-2' />
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-4">
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
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
                              />
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 cursor-pointer shadow-none hover:bg-transparent"
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
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <FormField
                      name="confirmPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                className="w-full pr-10 shadow-none rounded-xs focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-0 focus:ring-0 focus-visible:ring-0"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Enter your confirm password"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                              />
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 cursor-pointer shadow-none hover:bg-transparent"
                              >
                                {showConfirmPassword ? (
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
                  <Button
                    type="submit"
                    className="w-fit rounded-xs px-8 shadow-none bg-purple-500 hover:bg-purple-600 text-white"
                    size={"sm"}
                  >
                    {
                      isSubmitting ? (
                        <div className="flex items-center">
                          <Loader size={4} className="animate-spin" />
                        </div>
                      ) : (
                        "Save"
                      )
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className='shadow-none border border-border bg-white dark:bg-gray-900'>
          <CardHeader>
            <CardTitle className='text-lg md:text-2xl'>Linked Accounts</CardTitle>
            <CardDescription>
              Manage your connected third-party accounts.
            </CardDescription>
          </CardHeader>
          <Separator className='my-2' />
          <CardContent>
            <div className='grid gap-2'>
              {linkedAccounts.map((account) => (
                <div key={account.id} className='flex items-center justify-between p-3 border rounded-sm'>
                  <div className='flex items-center'>
                    <Avatar className="size-[42px] rounded-full">
                      {account.image && (
                        <AvatarImage src={account.image} alt={account.socialName} />
                      )}
                      <AvatarFallback className="rounded-full">
                        {account.accountName.charAt(0).toUpperCase()}{account.accountName.charAt(1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className='ml-2'>
                      <p className='text-sm font-medium'>{account.socialName}</p>
                      <p className='text-xs text-gray-500'>{account.email}</p>
                    </div>
                  </div>
                  <Button variant='destructive' size='sm' className='rounded-xs bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 '>Disconnect</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-none border border-border bg-white dark:bg-gray-900'>
          <CardHeader>
            <CardTitle className='text-lg md:text-2xl'>Active Sessions</CardTitle>
            <CardDescription>
              Manage devices that are logged into your account.
            </CardDescription>
          </CardHeader>
          <Separator className='my-2' />
          <CardContent>
            <div className='grid gap-2'>
              {activeSessions.map((session) => (
                <div key={session.id} className='flex items-center justify-between p-3 border rounded-sm'>
                  <div className='flex items-center'>
                    <Avatar className="size-[42px] rounded-full">
                      <AvatarFallback className="rounded-full">
                        <Laptop className='text-gray-500' />
                      </AvatarFallback>
                    </Avatar>

                    <div className='ml-2'>
                      <p className='text-sm font-bold'>{session.browserName} On {session.deviceName}</p>
                      <p className='text-sm text-gray-500'>{session.ipAddress} <span className='text-xs text-green-500'>{session.isCurrentlyActive ? '(Current Session)' : ''}</span></p>
                      <p className='text-xs text-gray-600'>{session.lastActiveAt}</p>
                    </div>
                  </div>
                  {
                    !session.isCurrentlyActive && (
                      <Button variant='destructive' size='sm' className='rounded-xs bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 '>Clear</Button>
                    )
                  }
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-none border border-border bg-white dark:bg-gray-900'>
          <CardHeader>
            <CardTitle className='text-lg md:text-2xl'>Danger Zone</CardTitle>
            <CardDescription>
              Manage irreversible account actions.
            </CardDescription>
          </CardHeader>
          <Separator className='my-2' />
          <CardContent>
            <div className='grid gap-4'>
              <div className='flex items-center p-4 border rounded-sm border-red-500 bg-red-50'>
                <div className='flex flex-col gap-2'>
                  <p className='text-base font-medium text-red-500 flex items-center gap-2'> <TriangleAlert size={16} /> Delete Your Account</p>
                  <p className='text-sm text-gray-500'>Once you delete your account, there is no going back. All your data, projects, and personal information will be permanently removed.</p>
                </div>
              </div>
              <Button variant='destructive' size='sm' className='w-fit rounded-xs bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 '>Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SettingPage