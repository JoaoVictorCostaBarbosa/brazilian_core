import { review } from "../../parfum/components/reviewCard";
import UserReviewBox from "./userReviewBox";

interface Props {
  reviews: review[];
  getReview: () => void;
}

export default function RenderUserReviews({ reviews, getReview }: Props) {


  return (
    <div className="flex flex-col gap-4 m-8">
      {reviews.map((review) => (
        <UserReviewBox
            key={review.id}
            review={review}
            getReview={getReview}
        />
    ))}
    </div>
  );
}

