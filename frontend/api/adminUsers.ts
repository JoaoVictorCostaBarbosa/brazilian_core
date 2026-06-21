import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

function authHeaders() {
  const auth_token = Cookies.get("auth_token");
  if (!auth_token) throw new Error("No auth token found");
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth_token}`,
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export async function listUsers() {
  try {
    const response = await axios.get<AdminUser[]>(
      "http://localhost:8000/api/admin/users/",
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  try {
    const response = await axios.patch(
      `http://localhost:8000/api/admin/users/${userId}/role`,
      { role },
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}
