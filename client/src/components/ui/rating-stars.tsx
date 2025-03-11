import { useState } from "react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
}

const RatingStars = ({
  rating,
  maxRating = 3,
  onChange,
  disabled = false,
  showLabels = true,
  size = "md",
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const labelText = (value: number) => {
    if (maxRating === 3) {
      return value === 1 ? "Poor" : value === 2 ? "Good" : "Excellent";
    }
    return `${value}/${maxRating}`;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const value = index + 1;
          const isActive = (hoverRating || rating) >= value;

          return (
            <button
              key={value}
              type="button"
              className={cn(
                "focus:outline-none transition-all duration-150",
                disabled
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer hover:scale-110"
              )}
              onClick={() => !disabled && onChange(value)}
              onMouseEnter={() => !disabled && setHoverRating(value)}
              onMouseLeave={() => !disabled && setHoverRating(null)}
              disabled={disabled}
              aria-label={`Rate ${value} out of ${maxRating}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  starSizes[size],
                  isActive
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300 fill-gray-300",
                  "transition-colors duration-200"
                )}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>

      {showLabels && rating > 0 && (
        <span className="text-sm font-medium">{labelText(rating)}</span>
      )}
    </div>
  );
};

export default RatingStars;
