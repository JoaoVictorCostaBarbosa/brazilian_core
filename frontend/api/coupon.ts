import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { CouponFormData } from "@/app/(private)/coupon/components/couponsRendedPage";

export async function getCoupons(){
    const auth_token = Cookies.get('auth_token');

    if(!auth_token){
        throw new Error("No auth token found");
    }

     try{
        const response = await axios.get(
        `http://localhost:8000/api/coupon/`, 
        {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        }
    )

    return response;

    } catch (error) {
        const err = error as AxiosError;

        return {
        status: err.response?.status,
        data: err.response?.data,
        };
  }
}

export async function postCoupon(coupon: CouponFormData){
    const auth_token = Cookies.get('auth_token');

    if(!auth_token){
        throw new Error("No auth token found");
    }

     try{
        const response = await axios.post(
        `http://localhost:8000/api/coupon/`, {
            "code": coupon.code,
            "discount_percentage": coupon.discount_percentage,
            "expires_at": coupon.expires_at
        },
        {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        }
    )

    return response;

    } catch (error) {
        const err = error as AxiosError;

        return {
        status: err.response?.status,
        data: err.response?.data,
        };
  }
}

export async function deleteCoupon(id: string) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }
  try{
    const response = await axios.delete(
        `http://localhost:8000/api/coupon/${id}`,{
            headers: {
                Accept:  "*/*",
                Authorization: `Bearer ${auth_token}`,
            },
        }
    )

    return response;

    } catch (error) {
    const err = error as AxiosError;

    return {
      status: err.response?.status,
      data: err.response?.data,
    };
  }

}

export async function patchCoupon(id: string, discount_percentage: number) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }
  try{
    const response = await axios.patch(
        `http://localhost:8000/api/coupon`,{
            "id": id,
            "discount_percentage": discount_percentage
        },{
            headers: {
                Accept:  "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        }
    )

    return response;

    } catch (error) {
    const err = error as AxiosError;

    return {
      status: err.response?.status,
      data: err.response?.data,
    };
  }

}
