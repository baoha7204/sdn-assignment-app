import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import RatingStars from "@/components/ui/rating-stars";

const formSchema = z.object({
  rating: z.number().min(1).max(3),
  content: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(500, "Comment cannot exceed 500 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface CommentFormProps {
  initialRating?: number;
  initialContent?: string;
  onSubmit: (rating: number, content: string) => Promise<void>;
  onCancel?: () => void;
}

const CommentForm = ({
  initialRating = 3,
  initialContent = "",
  onSubmit,
  onCancel,
}: CommentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialRating,
      content: initialContent,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values.rating, values.content);
      if (!initialContent) {
        form.reset();
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="flex space-y-2 gap-4">
              <FormControl>
                <div className="flex justify-center md:justify-start">
                  <RatingStars
                    rating={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    size="lg"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about this perfume..."
                  className="min-h-[100px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Submitting..."
              : initialContent
              ? "Update Review"
              : "Submit Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
