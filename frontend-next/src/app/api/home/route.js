
import { forwardCookies } from "@/lib/api-response";
import { djangoFetch } from "@/lib/django";

export async function GET(request) {
    const options = {
        method: "GET",
        cache: "no-store",
    };

    const {
        response: djangoResponse,
        setCookies
    } = await djangoFetch(request, "/categories/", options);

    if (djangoResponse.status === 401) {
        const errorResponse = Response.json(
            { error: "Authentication failed" },
            { status: 401 }
        );

        return forwardCookies(errorResponse, setCookies);
    }

    if (!djangoResponse.ok) {
        const errorResponse = Response.json(
            { error: "Failed to fetch data" },
            { status: djangoResponse.status }
        );

        return forwardCookies(errorResponse, setCookies);
    }

    const data = await djangoResponse.json();

    const finalResponse = Response.json(data, {
        status: djangoResponse.status
    });

    return forwardCookies(finalResponse, setCookies);
}
