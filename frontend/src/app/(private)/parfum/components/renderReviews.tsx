import { review } from "./reviewCard";

interface Props {
  reviews: review[];
}

export default function RenderReviews({ reviews }: Props) {
  return (
    <div className="flex flex-col gap-4 mt-8">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
        >
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
      ))}
    </div>
  );
}
