import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

function authHeaders() {
  const auth_token = Cookies.get("auth_token");
  if (!auth_token) throw new Error("No auth token found");
  return { accept: "application/json", Authorization: `Bearer ${auth_token}` };
}

export async function createOrder(coupon_code?: string) {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/order/${coupon_code ? `?coupon_code=${coupon_code}` : ""}`,
      {},
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}

export async function getOrders() {
  try {
    const response = await axios.get("http://localhost:8000/api/order/", {
      headers: authHeaders(),
    });
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/order/${orderId}`,
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}
