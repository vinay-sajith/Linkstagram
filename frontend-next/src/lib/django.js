import { cookies } from "next/headers";
export async function djangoFetch(path, options = {}) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access")?.value;
    const refreshToken = cookieStore.get("refresh")?.value;
    const response = await fetch(
        `${process.env.DJANGO_API_URL}${path}`,
        options={}

    );

    return response;
}