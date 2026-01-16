import axios from 'axios';
import Cookies from 'js-cookie';
import { Parfum } from '@/app/(private)/home/components/cart/cart';


export interface CartItem extends Parfum {
  quantity: number;
}

export async function setCartItem(id : String) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.post(
      `http://localhost:8000/api/cart/${id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          Accept: "application/json",
        },
      }
    );

    return response.status;

    } catch (error) {
        console.error("Error fetching parfums:", error);
    }
}
 
export async function removeCartItem(id : string) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.delete(
      `http://localhost:8000/api/cart/${id}`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          Accept: "application/json",
        },
      }
    );

    return response.status;

    } catch (error) {
        console.error("Error fetching parfums:", error);
    }
}

export async function getCarItem() {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.get<CartItem[]>(
      `http://localhost:8000/api/cart/`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );

    return response.data;

    } catch (error) {
        console.error("Error fetching parfums:", error);
        throw error
    }
}