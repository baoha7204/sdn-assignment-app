import { CommentData } from "@/api/perfume.api";

interface RatingSummaryProps {
  comments: CommentData[];
}

const RatingSummary = ({ comments }: RatingSummaryProps) => {
  // If no comments, show message
  if (!comments.length) {
    return (
      <div className="text-center p-4 border rounded-lg my-4">
        <p>No ratings yet. Be the first to rate this perfume!</p>
      </div>
    );
  }

  // Calculate rating metrics
  const totalRatings = comments.length;
  const averageRating =
    comments.reduce((acc, comment) => acc + comment.rating, 0) / totalRatings;

  // Count ratings by level
  const ratingCounts = {
    1: comments.filter((c) => c.rating === 1).length,
    2: comments.filter((c) => c.rating === 2).length,
    3: comments.filter((c) => c.rating === 3).length,
  };

  // Rating labels
  const ratingLabels = {
    1: "Poor",
    2: "Good",
    3: "Excellent",
  };

  return (
    <div className="bg-muted/50 p-6 rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4">Rating Summary</h3>

      <div className="flex items-center mb-4">
        <div className="text-3xl font-bold mr-4">
          {averageRating.toFixed(1)}
        </div>
        <div>
          <div className="flex gap-1 mb-1">
            {[1, 2, 3].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300 fill-gray-300"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {[3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center">
            <span className="w-20 text-sm">
              {ratingLabels[rating as keyof typeof ratingLabels]}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mx-2">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{
                  width: `${
                    (ratingCounts[rating as keyof typeof ratingCounts] /
                      totalRatings) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <span className="text-sm w-10 text-right">
              {ratingCounts[rating as keyof typeof ratingCounts]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSummary;
