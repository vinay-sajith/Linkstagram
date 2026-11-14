import { cookies } from "next/headers";

export async function POST(request) {

    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refresh")?.value;

    if (!refreshToken) {
        return Response.json(
            { error: "Refresh token missing" },
            { status: 401 }
        );
    }
    const refreshResponse = await fetch(`${process.env.DJANGO_API_URL}/token/refresh/`,
    {
        method:"POST",
        headers:{
            Cookie: `refresh=${refreshToken}`,
            
        },
        cache: "no-store",
    })
    if (!refreshResponse.ok) {
    return Response.json(
        { error: "Token refresh failed" },
        { status: 401 }
    );
}
    const setCookies = refreshResponse.headers.getSetCookie();
    const accessCookie=setCookies.find((cookie)=>cookie.startsWith("access="))
    const refreshCookie=setCookies.find((cookie)=>cookie.startsWith("refresh="))
    const newAccessToken = accessCookie
    ?.split(";")[0]
    .slice("access=".length);
    if (!newAccessToken) {
        return Response.json(
        { error: "access Token refresh failed" },
        { status: 401 }
    );
    
    }
    const newRefreshToken = refreshCookie
    ?.split(";")[0]
    .slice("refresh=".length);
    if (!newRefreshToken) {
        return Response.json(
        { error: "refresh Token refresh failed" },
        { status: 401 }
    
    );}
    cookieStore.set("refresh",newRefreshToken,{
        httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
});
 cookieStore.set("access",newAccessToken,{
        httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
});
    return Response.json({
    message: "Tokens refreshed successfully"
}, { status: 200 });
}
