import axios from "axios";
import { useAuthStore } from "../features/auth/store/authStore";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5209",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 500;

    const message =
      error.response?.data?.mensaje ??
      error.response?.data?.error ??
      error.message ??
      `Error ${status}`;

    return Promise.reject(new ApiError(status, message));
  },
);
