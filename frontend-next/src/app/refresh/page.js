
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RefreshPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const returnTo = searchParams.get("returnTo") || "/";

    useEffect(() => {
        async function refreshSession() {
            try {
                const response = await fetch("/api/refresh", {
                    method: "POST",
                });

                if (response.ok) {
                    router.replace(returnTo);
                } else {
                    router.replace("/login");
                }
            } catch (error) {
                console.error("Refresh failed:", error);
                router.replace("/login");
            }
        }

        refreshSession();
    }, [returnTo, router]);

    return <p>Refreshing your session...</p>;
}
