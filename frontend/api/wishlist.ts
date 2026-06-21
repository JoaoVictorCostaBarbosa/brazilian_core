import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

function authHeaders() {
  const auth_token = Cookies.get("auth_token");
  if (!auth_token) throw new Error("No auth token found");
  return { accept: "application/json", Authorization: `Bearer ${auth_token}` };
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
  name: string;
  price: number;
  description: string;
  stock_quantity: number;
  url_img: string;
}

export async function getWishlist() {
  try {
    const response = await axios.get<WishlistItem[]>(
      "http://localhost:8000/api/wishlist/",
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}

export async function addToWishlist(productId: string) {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/wishlist/${productId}`,
      {},
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    const response = await axios.delete(
      `http://localhost:8000/api/wishlist/${productId}`,
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}
