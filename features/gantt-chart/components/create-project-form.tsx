import React, { useTransition } from 'react'
import { Separator } from '@/components/ui/separator';
import { createProjectSchema } from '@/features/gantt-chart/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CustomDatePicker from '@/components/custom-date-picker';
import { Loader } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProject } from '../api/use-create-project';

interface CreateProjectForm {
    onCancel: () => void;
}
const CreateProjectForm = ({ onCancel }: CreateProjectForm) => {
    const { mutate, isPending } = useCreateProject();
    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(
            createProjectSchema
        ) as Resolver<z.infer<typeof createProjectSchema>>,
        defaultValues: {
            name: '',
            description: '',
            start_date: undefined,
            end_date: undefined
        }
    });

    const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
        // console.log(values);
        mutate({ json: values }, {
            onSuccess: ({ data }) => {
                form.reset();
                console.log(data);
            }
        })
    }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex px-7">
                <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
            </CardHeader>
            <CardContent className="px-7 py-0">
                <Separator className="mb-7" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Project name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Enter project name"
                                                className="w-full shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 rounded-xs focus-visible:border-purple-500"
                                                autoComplete="off"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="description">Project description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Enter project description"
                                                className="w-full shadow-none focus:shadow-none focus-visible:shadow-none focus:outline-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 rounded-xs focus-visible:border-purple-500"
                                                autoComplete="off"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                <FormField
                                    control={form.control}
                                    name="start_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="start_date">Start Date</FormLabel>
                                            <FormControl>
                                                <CustomDatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="w-full py-2 px-3 text-start text-sm transition-all outline-none ring-1 ring-gray-200 focus:ring-1 dark:ring-stone-700 focus:ring-purple-500 bg-white/5"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="end_date">End Date</FormLabel>
                                            <FormControl>
                                                <CustomDatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="w-full py-2 px-3 text-start text-sm transition-all outline-none ring-1 ring-gray-200 focus:ring-1 dark:ring-stone-700 focus:ring-purple-500 bg-white/5"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <Separator className="my-7" />
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                variant={"destructive"}
                                className={cn(
                                    "rounded-xs bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 dark:bg-red-200",
                                    !onCancel && "hidden"
                                )}
                                size={"sm"}
                                type="button"
                                disabled={isPending}
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant={"secondary"}
                                size={"sm"}
                                disabled={isPending}
                                className={cn(
                                    "bg-purple-100 hover:bg-purple-200 text-purple-500 hover:text-purple-600 rounded-xs"
                                )}

                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader className="h-4 w-4 animate-spin" />
                                        <span>Creating task...</span>
                                    </span>
                                ) : (
                                    <span>Create project</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreateProjectForm