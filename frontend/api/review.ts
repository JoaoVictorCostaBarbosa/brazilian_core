import axios, {AxiosError} from 'axios';
import Cookies from 'js-cookie';
import { postReviewProps } from '@/app/(private)/parfum/components/CreateUserReview';

export async function postProductReview(reviewData: postReviewProps) {
  const auth_token = Cookies.get("auth_token");

  if (!auth_token) {
    throw new Error("No auth token found");
  }

  try {
    const response = await axios.post(
      "http://localhost:8000/api/review/",
      {
        product_id: reviewData.product_id,
        comment: reviewData.comment,
        rating: reviewData.rating,
      },
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
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


export async function getProductReview(id : string) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }

  try{
    const response = await axios.get(
        `http://localhost:8000/api/review/${id}/product`,{
            headers: {
                Authorization: `Bearer ${auth_token}`,
                Accept: "application/json",
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

export async function getUserReview() {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }
  try{
    const response = await axios.get(
        `http://localhost:8000/api/review/me`,{
            headers: {
                Authorization: `Bearer ${auth_token}`,
                Accept: "application/json",
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

export async function deleteUserReview(id: string) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }
  try{
    const response = await axios.delete(
        `http://localhost:8000/api/review/${id}`,{
            headers: {
                Authorization: `Bearer ${auth_token}`,
                Accept:  "*/*",
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

export async function patchReviewComment(id: string, comment: string) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }
  try{
    const response = await axios.patch(
        `http://localhost:8000/api/review/comment`, {
          "id": id,
          "comment": comment,
        },
        {
           headers: {
            accept: "application/json",
            Authorization: `Bearer ${auth_token}`,
            "Content-Type": "application/json",
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

export async function patchReviewRating(id: string, rating: number) {
  const auth_token = Cookies.get('auth_token');
  
  if(!auth_token){
    throw new Error("No auth token found");
  }
  try{
    const response = await axios.patch(
        `http://localhost:8000/api/review/rating`, {
          "id": id,
          "rating": rating,
        },
        {
           headers: {
            accept: "application/json",
            Authorization: `Bearer ${auth_token}`,
            "Content-Type": "application/json",
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