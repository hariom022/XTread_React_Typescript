import axios from "axios";

console.log(
    "api_url",
    import.meta.env.VITE_APP_API_URL
);

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
});
//  Variables to handle simultaneous 401s and prevent refresh token reuse
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

// Add JWT token to every Axios request
api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

// 2. Handle expired/invalid session with automatic refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // If we receive a 401 Unauthorized and haven't already retried this request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // If the refresh endpoint itself returns 401, log out immediately
      if (originalRequest.url?.includes("/api/auth/refresh")) {
        handleForceLogout();
        return Promise.reject(error);
      }

      // 5-Minute Inactivity Check: If idle > 5 mins, do not refresh; log out
      const lastActivity = Number(localStorage.getItem("last_activity") || 0);
      const isIdleOver5Min = Date.now() - lastActivity > 5 * 60 * 1000;
      if (isIdleOver5Min) {
        handleForceLogout();
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        handleForceLogout();
        return Promise.reject(error);
      }

      // If a refresh is already in flight, queue this request until it finishes
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use raw axios to avoid interceptor recursion
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Store new access and rotated refresh token
        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        handleForceLogout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
export default api;