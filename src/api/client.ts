import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
