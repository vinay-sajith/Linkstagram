export  function forwardCookies(response,setCookies){
    setCookies.forEach((cookie) => {
        response.headers.append("Set-Cookie",cookie)
        
    });
    return response

}
