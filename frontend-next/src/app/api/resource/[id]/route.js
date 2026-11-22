import { NextResponse } from "next/server";
import { djangoFetch } from "../../../../lib/django";
import { forwardCookies } from "@/lib/api-response";

// 1. Shared function
async function forwardToDjango(request, context, method) {
  // Common logic for PATCH and DELETE
  const { id } = await context.params;

  const options ={
    method:method,
    headers:{},
    cache:"no-store",
  }
  if (method === "PATCH") {
  const data = await request.json();

  options.headers["Content-Type"] = "application/json";
  options.body = JSON.stringify(data);
}
const {response:djangoResponse,setCookies:setCookies} = await djangoFetch(request,
    `/resources/${id}/`,
    options
);
  const responseText = await djangoResponse.text();
if (!responseText) {
    const finalResponse = new Response(null, {
        status: djangoResponse.status,
    });

    return forwardCookies(finalResponse, setCookies);
}
  try {
    const data = JSON.parse(responseText);

    const finalResponse = Response.json(data, {
        status: djangoResponse.status,
    });

    return forwardCookies(finalResponse, setCookies);

} catch {
    const finalResponse = new Response(responseText, {
        status: djangoResponse.status,
    });

    return forwardCookies(finalResponse, setCookies);
}

 
}

// 2. DELETE handler
export async function DELETE(request, context) {
  return forwardToDjango(request, context, "DELETE");
}

// 3. PATCH handler
export async function PATCH(request, context) {
  return forwardToDjango(request, context, "PATCH");
}