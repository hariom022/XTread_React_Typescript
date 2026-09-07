const API_BASE_URL=import.meta.env.VITE_APP_API_URL;

//apiRequest<T> allows you to tell the function what type of data you expect back.
export async function apiRequest<T>(
  endpoint:string,    //I will provide the API endpoint as a string.
  options:RequestInit={}    //This is where you can provide additional fetch configuration.
):Promise<T> {            
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);

  headers.set("Content-Type","application/json");
  if(token){
    headers.set("Authorization",`Bearer ${token}`);
  }
debugger;
  const response = await fetch(`${API_BASE_URL}${endpoint}`,{
    ...options,
    headers,
  });

  if(response.status==401){
    localStorage.removeItem("token");   //If the token is invalid/expired, remove it.
    window.location.href="/login";        //This redirects the browser to: login
    throw new Error("Unauthorized");
  }
  if(!response.ok){
    const errorText=await response.text();
    throw new Error(
      errorText || `API Error: ${response.status}`
    );
  }

  return response.json();
}