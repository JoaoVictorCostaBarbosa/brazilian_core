"use client";

import { useEffect, useState } from "react";
import { getProductReview } from "../../../../../api/review";
import RenderReviews from "./renderReviews";
import CreateUserReview from "./CreateUserReview";

export interface review {
  id: string;
  user_id: string;
  product_id: string;
  comment: string;
  rating: number;
  created_at: string;
}

interface ReviewBoxProps {
  id: string;
}

export default function ReviewBox({ id }: ReviewBoxProps) {
  const [reviews, setReviews] = useState<review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getReview() {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductReview(id);
      if(response.status === 200){
        setReviews(response.data);
      }
    } catch {
      setError("Erro ao buscar review");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) getReview();
  }, [id]);

  return (
    <div className="bg-amber-100 shadow-lg rounded-2xl p-8 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-teal-950">Reviews</h2>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {reviews.length > 0 ? (<RenderReviews reviews={reviews} />) : (<h2>Sem reviews no momento</h2>)}
      {error && (
          <span className="text-sm text-red-600 font-medium">
            {error}
          </span>
        )}
      <CreateUserReview productId={id} onReviewCreated={getReview}/>
     
    </div>
  );
}
