import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import brandApi from "@/api/brand.api";
import { toast } from "sonner";

// Define schema for brand form validation
const brandSchema = z.object({
  brandName: z
    .string()
    .min(2, { message: "Brand name must be at least 2 characters" })
    .max(50, { message: "Brand name must be less than 50 characters" }),
});

type BrandFormValues = z.infer<typeof brandSchema>;

type ManageBrandDetailPageProps = {
  mode: "edit" | "add";
};

const ManageBrandDetailPage = ({ mode }: ManageBrandDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = mode === "edit";

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with validation schema
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brandName: "",
    },
  });

  // Fetch brand details if in edit mode
  useEffect(() => {
    const fetchBrand = async () => {
      if (!isEditMode) return;
      setIsLoading(true);

      try {
        const brandData = await brandApi.getBrandById(id);
        form.reset({ brandName: brandData.brandName });
      } catch (error) {
        console.error("Failed to fetch brand:", error);
        toast.error("Failed to load brand details");
        navigate("/admin/brands");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBrand();
  }, [id, isEditMode, navigate, form]);

  // Handle form submission
  const onSubmit = async (data: BrandFormValues) => {
    try {
      setIsSaving(true);

      if (isEditMode) {
        await brandApi.updateBrand(id, data);
        toast.success("Brand updated successfully");
      } else {
        await brandApi.createBrand(data);
        toast.success("Brand created successfully");
      }

      navigate("/admin/brands");
    } catch (error: any) {
      console.error("Error saving brand:", error);
      toast.error(
        error.response?.data?.errors?.[0]?.message || "Failed to save brand"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => navigate("/admin/brands")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
      </Button>
      <div className="container py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Brand" : "Create New Brand"}
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter brand name"
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="min-w-[120px]"
                >
                  {isSaving ? (
                    <Spinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isSaving ? "Saving..." : "Save Brand"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </>
  );
};

export default ManageBrandDetailPage;
