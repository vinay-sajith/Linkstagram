import { NextResponse } from "next/server";
import { djangoFetch } from "../../../../lib/django";

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
const djangoResponse = await djangoFetch(
    `/resources/${id}/`,
    options
);
  const responseText = await djangoResponse.text();
  if (!responseText) {
  return new Response(null, {
    status: djangoResponse.status,
  });
  
  
}
  try {
  const data = JSON.parse(responseText);

  return NextResponse.json(data, {
    status: djangoResponse.status,
  });
} catch {
  return new Response(responseText, {
    status: djangoResponse.status,
  });
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