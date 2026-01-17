import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8000/api";

export async function getProductsById(id: string) {
  const auth_token = Cookies.get("auth_token");

  if (!auth_token) {
    throw new Error("No auth token found");
  }

  const response = await axios.get(
    `${API_BASE_URL}/products/${id}`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );

  return response.data;
}
