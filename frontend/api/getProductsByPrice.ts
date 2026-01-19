import axios from 'axios';
import Cookies from 'js-cookie';

export async function getProductsByPrice(price: number) {
  const auth_token = Cookies.get('auth_token');
  
  if (!auth_token) {
    throw new Error("No auth token found");
  }

  try {
    const response = await axios.get(`http://localhost:8000/api/products/price/${price}`, {
      headers: {
        Authorization: `Bearer ${auth_token}` 
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products by price:", error);
    throw error; 
  }
}
