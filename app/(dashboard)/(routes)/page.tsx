"use client";

import PendingPage from "@/app/pending";
import { authClient } from "@/lib/auth-client";

// 1. Remove 'async' here
export default function Home() {
  const { 
    data: session, 
    isPending     
  } = authClient.useSession();

  if (isPending) {
    return (
      <PendingPage />
    )
  };

  return (
    <div>
       Welcome to Ganttatic {session?.user.name}
    </div>
  );
}