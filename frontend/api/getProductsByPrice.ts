import axios from 'axios';
import Cookies from 'js-cookie';
import { Parfum } from '@/app/(private)/home/components/cart/cart';

export async function getProductsByPrice(price : number) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.get(`http://localhost:8000/api/products/price/${price}`, {
        headers: {
            Authorization: `Bearer ${auth_token}` 
        }
    });
    const data = await response.data;
    return data;

    } catch (error) {
        console.error("Error fetching parfums:", error);
    }
}

export async function getProductsById(id : string) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.get(`http://localhost:8000/api/products/${id}`, {
        headers: {
            Authorization: `Bearer ${auth_token}` 
        }
    });
    const data = await response.data;
    return data;

    } catch (error) {
        console.error("Error fetching parfums:", error);
    }
}
    