import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

// 1. Shared function
async function forwardToDjango(request, context, method) {
  // Common logic for PATCH and DELETE
  const { id } = await context.params;
  const cookieStore = await cookies()
  const accessToken=cookieStore.get("access")?.value
  const refreshToken = cookieStore.get("refresh")?.value;
  if (!accessToken) {
  return NextResponse.json(
    { detail: "Authentication required" },
    { status: 401 }
  );}
  const options ={
    method:method,
    headers:{
        Cookie:`access=${accessToken}`,

    },
    cache:"no-store",
  }
  if (method === "PATCH") {
  const data = await request.json();

  options.headers["Content-Type"] = "application/json";
  options.body = JSON.stringify(data);
}
  const djangoResponse=await fetch(`${process.env.DJANGO_API_URL}/resources/${id}/`,options)
  const responseText = await djangoResponse.text();
  if (!responseText) {
  return new Response(null, {
    status: djangoResponse.status,
  });}
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