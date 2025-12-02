import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/useToast";

export const UserButton = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const { showToast } = useToast();
    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
                onError: (ctx) => {
                    showToast(
                        "Error",
                        ctx.error.message,
                        "error"
                    );
                }
            }
        })
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={"hover:bg-transparent"} asChild={true}>
                <Avatar className={"cursor-pointer border border-neutral-300 dark:border-neutral-500"}>
                    {
                        session?.user.image && (
                            <AvatarImage src={session?.user.image} />
                        )
                    }
                    <AvatarFallback>{session?.user.name[0].toUpperCase()}{session?.user.name[1].toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"end"}>
                <div className="flex flex-col justify-center items-center gap-2 px-2.5 py-2">
                    <Avatar className="size-12 text-xl rounded-full border border-neutral-300">
                        {
                            session?.user.image && (
                                <AvatarImage src={session?.user.image} />
                            )
                        }
                        <AvatarFallback>{session?.user.name[0].toUpperCase()}{session?.user.name[1].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200"> {session?.user.name} </p>
                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300"> {session?.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
                    <Settings className="size-4 text-black dark:text-white" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
                    <LogOut className="size-4 text-red-500" />
                    <span className="text-red-500">Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}