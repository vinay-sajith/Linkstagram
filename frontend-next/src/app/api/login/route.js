export async function POST(request) {
  try {
    const credentials = await request.json();

    const djangoResponse = await fetch(
      `${process.env.DJANGO_API_URL}/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        cache: "no-store",
      }
    );

    const data = await djangoResponse.json();

    const response = Response.json(data, {
      status: djangoResponse.status,
    });

    // Forward Django's HttpOnly cookies to the browser.
    const cookies = djangoResponse.headers.getSetCookie();

    cookies.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;

  } catch (error) {
    return Response.json(
      { message: "Unable to connect to the authentication service." },
      { status: 502 }
    );
  }
}