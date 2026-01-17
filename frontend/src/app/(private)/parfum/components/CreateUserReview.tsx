import { useForm } from "react-hook-form";
import { postProductReview } from "../../../../../api/review";
import { useState } from "react";

interface Props {
  productId: string;
  onReviewCreated: () => void;
}

export interface postReviewProps {
  product_id: string;
  comment: string;
  rating: number;
}

export default function CreateUserReview({ productId, onReviewCreated }: Props) {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(false);
  const [sucess, setSucess] = useState(false)

  async function setReview(review: postReviewProps) {
    setError(false);
    setSucess(false);

    const response = await postProductReview(review);

    if (response.status === 201) {
        setSucess(true);
        onReviewCreated();
    }  else {
        setError(true);
    }
  }


  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 w-full mx-auto mt-6">
      <h3 className="text-2xl font-bold text-teal-950 mb-4">
        Deixe sua avaliação
      </h3>

      <form
        onSubmit={handleSubmit((data) => {
          const reviewData: postReviewProps = {
            product_id: productId,
            comment: data.comment,
            rating: Number(data.rating),
          };
          setReview(reviewData);
        })}
        className="flex flex-col gap-5"
      >
       
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-teal-900">
            Comentário
          </label>
          <textarea
            {...register("comment")}
            placeholder="Conte o que achou do produto"
            required
            rows={4}
            className="resize-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-teal-900">
            Avaliação
          </label>
          <select
            {...register("rating")}
            required
            className="rounded-lg border border-teal-200 p-3 text-teal-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
          >
            <option value="">Selecione uma nota</option>
            <option value="5">⭐⭐⭐⭐⭐ </option>
            <option value="4">⭐⭐⭐⭐  </option>
            <option value="3">⭐⭐⭐ </option>
            <option value="2">⭐⭐ </option>
            <option value="1">⭐</option>
          </select>
        </div>

        {error && (
          <span className="text-sm text-red-600 font-medium">
            Usuário possui review cadastrada
          </span>
        )}

        {sucess && (
          <span className="text-sm text-green-600 font-medium">
            Review criada com sucesso
          </span>
        )}

        <button
          type="submit"
          className="
            bg-emerald-900 text-amber-100
            rounded-xl py-3 font-semibold text-lg
            hover:bg-emerald-800 hover:scale-[1.01]
            active:scale-95
            transition-all duration-200
          "
        >
          Enviar avaliação
        </button>
      </form>
    </div>
  );
}
