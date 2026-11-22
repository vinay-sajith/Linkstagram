import { forwardCookies } from "@/lib/api-response";
import { djangoFetch } from "@/lib/django";

export async function GET(request, context) {
    const {id}=await context.params;
    const options ={
    method:"GET",
    headers:{},
    cache:"no-store",
  }
const { response: djangoResponse, setCookies } =
    await djangoFetch(
        request,
        `/resources/?category_id=${id}`,
        options
    );
    if (djangoResponse.status === 401) {
    return Response.json(
        { error: "Authentication failed" },
        { status: 401 }
        
    );
}
 if (!djangoResponse.ok){
    return Response.json(
        { error: "Failed to fetch category data" },
        { status: 500 }
    );
}

const data = await djangoResponse.json()

const finalresponse=Response.json(data, {
        status: djangoResponse.status,
    });
    return forwardCookies(finalresponse,setCookies)


}