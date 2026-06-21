import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Parfum } from "@/app/(private)/cart/page";

function authHeaders() {
  const auth_token = Cookies.get("auth_token");
  if (!auth_token) throw new Error("No auth token found");
  return { Authorization: `Bearer ${auth_token}` };
}

export interface FilterParams {
  name?: string;
  max_price?: number;
  min_rating?: number;
  in_stock?: boolean;
}

export async function filterProducts(params: FilterParams): Promise<Parfum[]> {
  const query = new URLSearchParams();
  if (params.name) query.set("name", params.name);
  if (params.max_price !== undefined) query.set("max_price", String(params.max_price));
  if (params.min_rating !== undefined) query.set("min_rating", String(params.min_rating));
  if (params.in_stock) query.set("in_stock", "true");

  try {
    const response = await axios.get<Parfum[]>(
      `http://localhost:8000/api/products/filter?${query.toString()}`,
      { headers: authHeaders() }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error filtering products:", err);
    throw error;
  }
}
