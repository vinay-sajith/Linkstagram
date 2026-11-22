
import { NextResponse } from "next/server";
function isTokenExpired(token) {
    const payload = token.split(".")[1];

    const base64 = payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const paddedPayload = base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        "="
    );

    const decodedPayload = atob(paddedPayload);

    const data = JSON.parse(decodedPayload);

    const expiration = data.exp;

    const currentTime = Math.floor(Date.now() / 1000);

    return expiration <= currentTime;
}
export function proxy(request) {
    const accessToken = request.cookies.get("access")?.value;

    const protectedPaths = ["/", "/categories"];

    const isProtectedPath = protectedPaths.some(
        (path) =>
            request.nextUrl.pathname === path ||
            request.nextUrl.pathname.startsWith(`${path}/`)
    );

    if (!isProtectedPath) {
        return NextResponse.next();
    }

if (!accessToken || isTokenExpired(accessToken)) {
    const refreshToken = request.cookies.get("refresh")?.value;

    if (refreshToken) {
        const refreshUrl = new URL("/refresh", request.url);

        refreshUrl.searchParams.set(
            "returnTo",
            request.nextUrl.pathname + request.nextUrl.search
        );

        return NextResponse.redirect(refreshUrl);
    }

    return NextResponse.redirect(new URL("/login", request.url));
}

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/categories/:path*"],
};
