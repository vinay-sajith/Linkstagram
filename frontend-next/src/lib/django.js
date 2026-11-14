import { cookies } from "next/headers";
export async function djangoFetch(path, options = {}) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access")?.value;
    const refreshToken = cookieStore.get("refresh")?.value;
     const headers={
        ...options.headers,
        Cookie: `access=${accessToken}`,
            
        }
   const response = await fetch(
    `${process.env.DJANGO_API_URL}${path}`,
    {
        ...options,
        headers: headers
    });
    if (response.status === 401 && refreshToken){
            const refreshResponse = await fetch(
    `${process.env.DJANGO_API_URL}/token/refresh/`,
    {
        method: "POST",
        headers: {
            Cookie: `refresh=${refreshToken}`,
        },
        cache: "no-store",
    }
);
    if (!refreshResponse.ok) {
    return response;
}
    const setCookies = refreshResponse.headers.getSetCookie();
    const accessCookie=setCookies.find((cookie)=>cookie.startsWith("access="))
    const newAccessToken = accessCookie
    ?.split(";")[0]
    .slice("access=".length);
    if (!newAccessToken) {
    return response;
}
    cookieStore.set("access", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
});
    const retryResponse = await fetch(
    `${process.env.DJANGO_API_URL}${path}`,
    {
        ...options,
        headers: {
            ...headers,
            Cookie: `access=${newAccessToken}`,
        },
    }
);


return retryResponse;
    }
    

    return response;
}