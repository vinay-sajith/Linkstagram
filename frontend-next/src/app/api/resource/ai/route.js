import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access")?.value;
  const refreshToken = cookieStore.get("refresh")?.value;


  if (!accessToken) {
    return NextResponse.json(
      { detail: "Authentication required" },
      { status: 401 }
    );
  }

  const response = await fetch(
    `${process.env.DJANGO_API_URL}/resources/ai/`,
    {
      method: "POST",
      headers: {
        Cookie: `access=${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    }
  );

  const responseData = await response.json();

  return NextResponse.json(responseData, {
    status: response.status,
  });
}