import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

function authHeaders() {
  const auth_token = Cookies.get("auth_token");
  if (!auth_token) throw new Error("No auth token found");
  return { accept: "application/json", Authorization: `Bearer ${auth_token}` };
}

export interface OverviewStats {
  total_orders: number;
  total_revenue: number;
  avg_ticket: number;
  total_users: number;
  out_of_stock: number;
  low_stock: number;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  product_url_img: string;
  total_sold: number;
  total_revenue: number;
}

export interface RevenueDay {
  day: string;
  revenue: number;
  orders_count: number;
}

export async function getOverview() {
  try {
    const response = await axios.get<OverviewStats>(
      "http://localhost:8000/api/admin/stats/overview",
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}

export async function getTopProducts(limit = 5) {
  try {
    const response = await axios.get<TopProduct[]>(
      `http://localhost:8000/api/admin/stats/top-products?limit=${limit}`,
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}

export async function getRevenueByPeriod(start: string, end: string) {
  try {
    const response = await axios.get<RevenueDay[]>(
      `http://localhost:8000/api/admin/stats/revenue?start=${start}&end=${end}`,
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}
