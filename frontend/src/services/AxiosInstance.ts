// src/services/AxiosInstance.ts
import axios from "axios";
import { useLoading } from "@/hooks/useLoading";
import { showInfoToast } from "@/utils/Toast";

export const baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

let activeRequests = 0;

// Token refresh logic
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(null);
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
  if (activeRequests === 0) {
    useLoading.getState().start(); // called only when request starts → safe
  }
  activeRequests++;
  return config;
});

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests <= 0) {
      activeRequests = 0;
      useLoading.getState().stop();
    }
    return response;
  },
  async (error) => {
    activeRequests--;
    if (activeRequests <= 0) {
      activeRequests = 0;
      useLoading.getState().stop();
    }

    const originalRequest = error.config;

    // 403 - blocked user
    if (error.response?.status === 403) {
      const msg = error.response.data?.message || "";
      if (msg.includes("blocked")) {
        localStorage.clear();
        sessionStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/admin/demo";
        }
      }
      return Promise.reject(error);
    }

    // 401 - token expired + refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.get("/shared/auth/refresh-token");
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        showInfoToast("Session expired. Please login again.");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;