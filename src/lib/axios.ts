import axios from "axios";

export function getTokenData() {
  if (typeof window === "undefined") {
    return {
      accessToken: null,
      refreshToken: null,
      accessExpired: null,
      refreshExpired: null,
    };
  }
  return {
    accessToken: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
    accessExpired: localStorage.getItem("access_token_expired"),
    refreshExpired: localStorage.getItem("refresh_token_expired"),
  };
}

export function saveTokenData(data: {
  access_token: string;
  refresh_token: string;
  access_token_expires_at: number;
  refresh_token_expires_at: number;
}) {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  localStorage.setItem(
    "access_token_expired",
    data.access_token_expires_at.toString()
  );
  localStorage.setItem(
    "refresh_token_expired",
    data.refresh_token_expires_at.toString()
  );
}

export function ClearToken() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("access_token_expired");
  localStorage.removeItem("refresh_token_expired");
}

export function axiosInstance() {
  const { accessToken } = getTokenData();

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE + "/api/v1",
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });

  instance.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const { refreshToken } = getTokenData();
        if (!refreshToken) {
          ClearToken();
          window.location.reload();
          return Promise.reject(new Error("No refresh token available"));
        }

        try {
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/customers/refresh-token`,
            {
              refresh_token: refreshToken,
            }
          );

          const result = refreshResponse.data.data;
          saveTokenData({
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            access_token_expires_at: result.access_token_expires_at,
            refresh_token_expires_at: result.refresh_token_expires_at,
          });

          originalRequest.headers.Authorization = `Bearer ${result.access_token}`;

          return instance(originalRequest);
        } catch (err) {
          console.error("Refresh token failed:", err);
          ClearToken();
          return Promise.reject(err);
        }
      }

      return Promise.reject(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  );

  return instance;
}
