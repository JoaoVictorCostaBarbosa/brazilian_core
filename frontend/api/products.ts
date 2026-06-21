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

export interface ProductFormData {
  name: string;
  price: number;
  description: string;
  stock_quantity: number;
  url_img: string;
}

export async function searchProducts(name: string) {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/products/search?name=${encodeURIComponent(name)}`,
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}

export async function createProduct(data: ProductFormData) {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/products/",
      data,
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    const response = await axios.patch(
      `http://localhost:8000/api/products/${id}`,
      data,
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}

export async function deleteProduct(id: string) {
  try {
    const response = await axios.delete(
      `http://localhost:8000/api/products/${id}`,
      { headers: authHeaders() }
    );
    return response;
  } catch (error) {
    const err = error as AxiosError;
    return { status: err.response?.status, data: err.response?.data };
  }
}
