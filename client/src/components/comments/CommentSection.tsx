import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CommentData } from "@/api/perfume.api";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import RatingSummary from "./RatingSummary";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface CommentSectionProps {
  perfumeId: string;
  comments: CommentData[];
  onAddComment: (
    perfumeId: string,
    rating: number,
    content: string
  ) => Promise<void>;
  onUpdateComment: (
    perfumeId: string,
    commentId: string,
    rating: number,
    content: string
  ) => Promise<void>;
  onDeleteComment: (perfumeId: string, commentId: string) => Promise<void>;
}

const CommentSection = ({
  perfumeId,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: CommentSectionProps) => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Check if user can add a comment (authenticated, not admin, hasn't commented already)
  const canAddComment =
    currentUser &&
    !currentUser.isAdmin &&
    !comments.some((comment) => comment.author.id === currentUser.id);

  const handleAddComment = async (rating: number, content: string) => {
    try {
      setError(null);
      await onAddComment(perfumeId, rating, content);
    } catch (err) {
      setError(
        err.response?.data?.errors[0]?.message || "Failed to add comment"
      );
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

      <RatingSummary comments={comments} />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentUser ? (
        currentUser.isAdmin ? (
          <Alert className="mb-6">
            <AlertDescription>Admins cannot leave comments.</AlertDescription>
          </Alert>
        ) : (
          canAddComment && (
            <div className="border rounded-lg p-4 mb-8">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <CommentForm onSubmit={handleAddComment} />
            </div>
          )
        )
      ) : (
        <Alert className="mb-6">
          <AlertDescription className="flex">
            Please{" "}
            <Link to="/login" className="underline font-medium">
              sign in
            </Link>{" "}
            to leave a review.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {comments.length} {comments.length === 1 ? "Review" : "Reviews"}
        </h3>

        {comments.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              currentUser={currentUser}
              key={comment._id}
              comment={comment}
              perfumeId={perfumeId}
              onUpdate={onUpdateComment}
              onDelete={onDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
