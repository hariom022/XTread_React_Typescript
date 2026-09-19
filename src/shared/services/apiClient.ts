// const API_BASE_URL=import.meta.env.VITE_APP_API_URL;

// //apiRequest<T> allows you to tell the function what type of data you expect back.
// export async function apiRequest<T>(
//   endpoint:string,    //I will provide the API endpoint as a string.
//   options:RequestInit={}    //This is where you can provide additional fetch configuration.
// ):Promise<T> {            
//   const token = localStorage.getItem("token");
//   const headers = new Headers(options.headers);

//   headers.set("Content-Type","application/json");
//   if(token){
//     headers.set("Authorization",`Bearer ${token}`);
//   }
// debugger;
//   const response = await fetch(`${API_BASE_URL}${endpoint}`,{
//     ...options,
//     headers,
//   });

//   if(response.status==401){
//     localStorage.removeItem("token");   //If the token is invalid/expired, remove it.
//     window.location.href="/login";        //This redirects the browser to: login
//     throw new Error("Unauthorized");
//   }
//   if(!response.ok){
//     const errorText=await response.text();
//     throw new Error(
//       errorText || `API Error: ${response.status}`
//     );
//   }

//   return response.json();
// }

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

// Concurrency control to prevent refresh token reuse detection
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleForceLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("last_activity");
  window.location.href = "/login";
};

// Direct refresh call using raw fetch
async function requestTokenRefresh(refreshToken: string): Promise<string> {
  const refreshUrl = `${API_BASE_URL.replace(/\/+$/, "")}/auth/refresh`;

  const res = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  const newAccessToken = data.token;
  const newRefreshToken = data.refreshToken;

  localStorage.setItem("token", newAccessToken);
  localStorage.setItem("refreshToken", newRefreshToken);

  return newAccessToken;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const cleanBase = API_BASE_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const targetUrl = `${cleanBase}${cleanEndpoint}`;

  const response = await fetch(targetUrl, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // If refresh itself failed, log out
    if (endpoint.includes("/auth/refresh")) {
      handleForceLogout();
      throw new Error("Unauthorized");
    }

    // 5-Minute Inactivity check
    const lastActivity = Number(localStorage.getItem("last_activity") || 0);
    const isIdleOver5Min = Date.now() - lastActivity > 5 * 60 * 1000;
    if (isIdleOver5Min) {
      handleForceLogout();
      throw new Error("Session expired due to inactivity");
    }

    const currentRefreshToken = localStorage.getItem("refreshToken");
    if (!currentRefreshToken) {
      handleForceLogout();
      throw new Error("Unauthorized");
    }

    // If another request is currently refreshing the token, wait for it
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        headers.set("Authorization", `Bearer ${newToken}`);
        return fetch(targetUrl, { ...options, headers }).then((res) => {
          if (!res.ok) throw new Error("Retry failed");
          return res.json();
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await requestTokenRefresh(currentRefreshToken);
      processQueue(null, newToken);

      // Retry original request with the fresh token
      headers.set("Authorization", `Bearer ${newToken}`);
      const retryResponse = await fetch(targetUrl, {
        ...options,
        headers,
      });

      if (!retryResponse.ok) {
        const errorText = await retryResponse.text();
        throw new Error(errorText || `API Error: ${retryResponse.status}`);
      }

      return retryResponse.json();
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      handleForceLogout();
      throw new Error("Unauthorized");
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  // Handle 204 No Content responses safely
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}