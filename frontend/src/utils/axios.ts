import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://devnext.online/api',
  withCredentials: true,
});

export default axiosInstance;