import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CommentData } from "@/api/perfume.api";
import CommentForm from "./CommentForm";
import { useAuth } from "@/contexts/auth.context";

interface CommentItemProps {
  comment: CommentData;
  perfumeId: string;
  onUpdate: (
    perfumeId: string,
    commentId: string,
    rating: number,
    content: string
  ) => Promise<void>;
  onDelete: (perfumeId: string, commentId: string) => Promise<void>;
}

const CommentItem = ({
  comment,
  perfumeId,
  onUpdate,
  onDelete,
}: CommentItemProps) => {
  const [editing, setEditing] = useState(false);
  const { currentUser } = useAuth();

  const isAuthor = currentUser && currentUser.id === comment.author.id;

  // Convert rating number to star display
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(3)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              i < rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300 fill-gray-300"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleUpdate = async (rating: number, content: string) => {
    await onUpdate(perfumeId, comment._id, rating, content);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDelete(perfumeId, comment._id);
    }
  };

  if (editing) {
    return (
      <div className="border rounded-lg p-4 mb-4">
        <CommentForm
          initialRating={comment.rating}
          initialContent={comment.content}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold">{comment.author.name}</div>
        <div className="text-sm text-gray-500">
          {format(new Date(comment.createdAt), "PPP")}
        </div>
      </div>

      <div className="mb-2">{renderRatingStars(comment.rating)}</div>
      <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>

      {isAuthor && (
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
