import { review } from "../../parfum/components/reviewCard";
import { useState } from "react";
import { deleteUserReview } from "../../../../../api/review";
import { useForm } from 'react-hook-form';
import { patchReviewComment, patchReviewRating } from "../../../../../api/review";

interface Props {
  review: review;
  getReview: () => void;
}

interface userEditeReviewProps {
  id: string,
  comment: string | null,
  rating: number | null,
}

export default function UserReviewBox({ review, getReview }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      comment: review.comment ?? "",
      rating: review.rating ?? "",
    },
  });

  async function deleteReview(id: string) {
    try {
      setLoading(true);
      setError(null);
      const response = await deleteUserReview(id);
      if (response.status === 204) {
        getReview();
      }
    } catch {
      setError("Erro ao deletar review");
    } finally {
      setLoading(false);
    }
  }

  async function updateUserReview(data: userEditeReviewProps) {
    try {
      const reviewBuffer = review;

      if (data.comment !== null && data.comment !== reviewBuffer.comment) {
        await patchReviewComment(data.id, data.comment);
      }

      if (data.rating !== null && data.rating !== reviewBuffer.rating) {
        await patchReviewRating(data.id, data.rating);
      }

      setOpenEdit(false);
      await getReview();
    } catch {
      setError("Erro ao atualizar review");
    }
  }

  return (
    <div
      key={review.id}
      className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
    >
      <div className={`${openEdit ? "hidden" : "block"}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={index < review.rating ? "#facc15" : "#e5e7eb"}
                className="w-5 h-5"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString("pt-BR")}
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {review.comment}
        </p>
      </div>

      <div className={`${openEdit ? "block" : "hidden"}`}>
        <form
          onSubmit={handleSubmit((data) => {
            const reviewData: userEditeReviewProps = {
              id: review.id,
              comment: data.comment || null,
              rating: data.rating ? Number(data.rating) : null,
            };
            updateUserReview(reviewData);
          })}
          className="flex flex-col gap-5"
        >

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-teal-900">Comentário</label>
            <textarea
              {...register("comment")}
              placeholder="Digite seu comentario"
              rows={4}
              className="resize-none rounded-lg border border-teal-200 p-3 text-teal-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-teal-900">Avaliação</label>
            <select
              {...register("rating")}
              className="rounded-lg border border-teal-200 p-3 text-teal-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
            >
              <option value="">Selecione uma nota</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>
          </div>

          {error && (
            <span className="text-sm text-red-600 font-medium">
              {error}
            </span>
          )}

          <button
            type="submit"
            className="bg-emerald-900 max-w-fit px-2 text-amber-100 rounded-xl py-3 font-semibold text-lg hover:bg-emerald-800 hover:scale-[1.01] active:scale-95 transition-all duration-200"
          >
            Enviar avaliação
          </button>

        </form>
      </div>

      <div className="mt-2 flex gap-4">
        {!openEdit && (
          <button
            onClick={() => deleteReview(review.id)}
            className="text-red-500 hover:text-red-900 transition bg-white border border-red-200 rounded-lg shadow-sm hover:border-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash mx-3 my-2" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
          </button>
        )}

        <button
          className={`text-teal-950 border border-teal-200 px-2 max-w-fit rounded-lg shadow shadow-teal-200 hover:border-teal-950 ${openEdit ? "hidden" : "block"}`}
          onClick={() => setOpenEdit(true)}
        >
          Editar Avaliação
        </button>
      </div>
    </div>
  );
}
