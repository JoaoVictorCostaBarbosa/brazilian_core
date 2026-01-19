import axios from 'axios';
import Cookies from 'js-cookie';


export default async function getProducts(start: number, end:number) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.get(`http://localhost:8000/api/products/${start}/${end}`, {
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
    