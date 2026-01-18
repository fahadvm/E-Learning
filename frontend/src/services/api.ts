import axiosInstance from "./AxiosInstance";
import { showErrorToast, showInfoToast } from "../utils/Toast";

type ApiOptions = {
  showToast?: boolean;
};

const defaultOptions: ApiOptions = {
  showToast: true,
};

const handleApiError = (error: any, options: ApiOptions) => {
  console.error("API Error:", error);

  if (!options.showToast) return;

  const message = error?.response?.data?.message || error.message || "Request failed";
  console.log("error for testing ", error?.response?.data)

  if (error.response?.status === 401) {
    showInfoToast("Please login.");
    // Router.push("/student/login");
  } else if (error.response?.status === 409) {
    //info message handling
    showInfoToast(message);
  } else {
    showErrorToast(message);
  }
};

export const postRequest = async <T = any>(
  url: string,
  body: object | FormData,
  options: ApiOptions = defaultOptions
): Promise<T | null> => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const res = await axiosInstance.post(url, body, { headers });
    console.log("res in api.ts : ", res)

    if (!res.data.ok) {
      throw new Error(res.data.message || 'Request failed');
    }

    return res.data;
  } catch (error: any) {
    handleApiError(error, options);
    return null;
  }
};

export const getRequest = async <T = any>(
  url: string,
  params?: object,
  options: ApiOptions = defaultOptions
): Promise<T | null> => {
  try {
    const res = await axiosInstance.get(url, params ? { params } : {});
    if (!res.data.ok) {
      throw new Error(res.data.message || 'Request failed');
    }
    return res.data;
  } catch (error: any) {
    handleApiError(error, options);
    return null;
  }
};

export const patchRequest = async <T = any>(
  url: string,
  body: object,
  options: ApiOptions = defaultOptions
): Promise<T | null> => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const res = await axiosInstance.patch(url, body, { headers });
    if (!res.data.ok) {
      throw new Error(res.data.message || 'Request failed');
    }
    return res.data;
  } catch (error: any) {
    handleApiError(error, options);
    return null;
  }

}
export const putRequest = async <T = any>(
  url: string,
  body: object,
  options: ApiOptions = defaultOptions
): Promise<T | null> => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const res = await axiosInstance.put(url, body, { headers });
    if (!res.data.ok) {
      throw new Error(res.data.message || 'Request failed');
    }
    return res.data;
  } catch (error: any) {
    handleApiError(error, options);
    return null;
  }
}

export const deleteRequest = async <T = any>(
  url: string,
  params?: object,
  options: ApiOptions = defaultOptions
): Promise<T | null> => {
  try {
    const res = await axiosInstance.delete(url, params ? { params } : {});
    if (!res.data.ok) {
      throw new Error(res.data.message || 'Request failed');
    }
    return res.data;
  } catch (error: any) {
    handleApiError(error, options);
    return null;
  }
};

export const downloadRequest = async (
  url: string,
  params?: object
): Promise<Blob | null> => {
  try {
    const res = await axiosInstance.get(url, {
      params,
      responseType: 'blob'
    });
    return res.data;
  } catch (error: any) {
    console.error("Download Error:", error);
    return null;
  }
};