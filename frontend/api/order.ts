import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export async function createOrder(coupon_code?: string) {
  const auth_token = Cookies.get("auth_token");

  if (!auth_token) {
    throw new Error("No auth token found");
  }

  try {
    const response = await axios.post(
      `http://localhost:8000/api/order/${coupon_code ? `?coupon_code=${coupon_code}` : ""}`,
      {},
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );

    return response;
  } catch (error) {
    const err = error as AxiosError;

    return {
      status: err.response?.status,
      data: err.response?.data,
    };
  }
}
