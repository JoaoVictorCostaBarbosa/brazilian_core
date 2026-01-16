import Cookies from "js-cookie";
import { UserPropsReturn } from "@/app/(private)/user/context/userContext";
import axios from "axios";

export async function updateUserPassword(password : string) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.patch<UserPropsReturn>(
      `http://localhost:8000/api/user/me/${password}/password`,
      {},
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          Accept: "application/json",
        },
      }
    );

    if(response.status = 200) return response.data;

    } catch (error) {
        console.error("Error fetching parfums:", error);
        throw error;
    }
}

export async function getCurrUser() {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.get<UserPropsReturn>(
      `http://localhost:8000/api/user/me/`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          Accept: "application/json",
        },
      }
    );

    if(response.status = 200) return response.data;

    } catch (error) {
        console.error("Error fetching parfums:", error);
        throw error;
    }
}

export async function updateUserEmail(email: string) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.patch<UserPropsReturn>(
      `http://localhost:8000/api/user/me/${email}/email`,{},
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          Accept: "application/json",
        },
      }
    );

    if(response.status = 200) return response.data;

    } catch (error) {
        console.error("Error fetching parfums:", error);
        throw error;
    }
}

export async function updateUserName(name: string) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.patch<UserPropsReturn>(
      `http://localhost:8000/api/user/me/${name}/name`,
      {},
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          Accept: "application/json",
        },
      }
    );

    if(response.status === 200) return response.data;

    } catch (error) {
        console.error("Error fetching parfums:", error);
        throw error;
    }
}
