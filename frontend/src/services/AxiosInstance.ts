import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useLoading } from "@/hooks/useLoading";
import { showInfoToast } from "@/utils/Toast";

export const baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

let activeRequests = 0;
const { start, stop } = useLoading.getState();

axiosInstance.interceptors.request.use((config) => {
  if (activeRequests === 0) start();
  activeRequests++;
  return config;
});

const handleResponseCompletion = () => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    stop();
  }
};

// Token refresh handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(null);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    handleResponseCompletion();
    return response;
  },
  async (error: unknown) => {
    handleResponseCompletion();

    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (error.response?.status === 403) {
      const msg = (error.response.data as { message?: string })?.message || "";
      if (msg.toLowerCase().includes("blocked")) {
        // Cleanup all auth data
        localStorage.clear();
        sessionStorage.clear();

        // Specific redirection for each app section
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          if (path.startsWith("/student")) window.location.href = "/student/login";
          else if (path.startsWith("/teacher")) window.location.href = "/teacher/login";
          else if (path.startsWith("/company")) window.location.href = "/company/login";
          else if (path.startsWith("/employee")) window.location.href = "/employee/login";
          else window.location.href = "/";
        }
      }
      return Promise.reject(error);
    }

    // Only handle 401 errors here
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
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