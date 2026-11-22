import { cookies } from "next/headers";
export async function djangoFetch(request,path, options = {}) {
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
    console.log("ACCESS TOKEN EXISTS:", !!accessToken);
console.log("REFRESH TOKEN EXISTS:", !!refreshToken);
console.log("DJANGO RESPONSE STATUS:", response.status);
    const refreshUrl = new URL("/api/refresh", request.url);
    if (response.status === 401 && refreshToken){
           const refreshResponse = await fetch(refreshUrl, {
    method: "POST",
    headers:{
        Cookie:`refresh=${refreshToken}`,
    }
});

    if (!refreshResponse.ok) {
    return {
        response,
        setCookies: []

    };
}
    const setCookies = refreshResponse.headers.getSetCookie();
    const accessCookie=setCookies.find((cookie)=>cookie.startsWith("access="))
    const refreshCookie=setCookies.find((cookie)=>cookie.startsWith("refresh="))
    const newAccessToken=accessCookie?.split(";")[0].slice("access=".length);
    if (!newAccessToken) {
    return {
        response: Response.json(
            { error: "Access token refresh failed" },
            { status: 401 }
        ),
        setCookies: [],

    };
}
    const newRefreshToken=refreshCookie?.split(";")[0].slice("refresh=".length)
    if (!newRefreshToken) {
        return {
    response: Response.json(
        { error: "access Token refresh failed" },
        { status: 401 }
    ),
    setCookies: []
};}
console.log("INTERNAL REFRESH STATUS:", refreshResponse.status);


console.log("REFRESH RESPONSE COOKIE COUNT:", setCookies.length);
console.log(
    "NEW ACCESS COOKIE:",
    setCookies.some(c => c.startsWith("access="))
);
console.log(
    "NEW REFRESH COOKIE:",
    setCookies.some(c => c.startsWith("refresh="))
);
    
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
console.log("RETRY RESPONSE STATUS:", retryResponse.status);


return {
    response: retryResponse,
    setCookies
};
    }
    

    return {
    response:response,
    setCookies: []
};
}