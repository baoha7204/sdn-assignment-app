import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

import perfumeApi, { PerfumeInput } from "@/api/perfume.api";
import brandApi, { BrandData } from "@/api/brand.api";
import { PerfumeConcentration, TargetAudience } from "@/lib/constants";

const formSchema = z.object({
  perfumeName: z.string().min(2, {
    message: "Perfume name must be at least 2 characters.",
  }),
  uri: z.string().url({
    message: "Please enter a valid URL.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  concentration: z.string().min(1, {
    message: "Please select a concentration.",
  }),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  volume: z.coerce.number().positive({
    message: "Volume must be a positive number.",
  }),
  targetAudience: z.string().min(1, {
    message: "Please select a target audience.",
  }),
  brand: z.string().min(1, {
    message: "Please select a brand.",
  }),
  isActive: z.boolean().default(true),
});

export type ManagePerfumeDetailPageProps = {
  mode: "edit" | "add";
};

const ManagePerfumeDetailPage = ({ mode }: ManagePerfumeDetailPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = mode === "edit";
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [brands, setBrands] = useState<BrandData[]>([]);

  // Create form with validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      perfumeName: "",
      uri: "",
      price: 0,
      concentration: "",
      description: "",
      ingredients: "",
      volume: 0,
      targetAudience: "",
      brand: "",
      isActive: true,
    },
  });

  // Load all brands for the select dropdown
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await brandApi.getAllBrands(1, 100);
        setBrands(data.brands);
      } catch (error) {
        toast.error("Failed to load brands");
      }
    };

    loadBrands();
  }, []);

  // Load perfume data when editing
  useEffect(() => {
    const loadPerfume = async () => {
      if (!isEditing) return;

      try {
        const perfume = await perfumeApi.getPerfumeById(id as string);

        // Populate the form with perfume data
        form.reset({
          perfumeName: perfume.perfumeName,
          uri: perfume.uri,
          price: perfume.price,
          concentration: perfume.concentration,
          description: perfume.description || "",
          ingredients: perfume.ingredients || "",
          volume: perfume.volume,
          targetAudience: perfume.targetAudience,
          brand: perfume.brand.id,
          isActive: perfume.isActive,
        });
      } catch (error) {
        toast.error("Failed to load perfume data");
        navigate("/admin/perfumes");
      } finally {
        setLoading(false);
      }
    };

    loadPerfume();
  }, [id, isEditing, form, navigate]);

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);

    try {
      const perfumeData: PerfumeInput = {
        ...values,
      };

      if (isEditing) {
        await perfumeApi.updatePerfume(id as string, perfumeData);
        toast.success("Perfume updated successfully");
      } else {
        await perfumeApi.createPerfume(perfumeData);
        toast.success("Perfume created successfully");
      }

      navigate("/admin/perfumes");
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0]?.message ||
          `Failed to ${isEditing ? "update" : "create"} perfume`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Perfume" : "Add New Perfume"}
        </h1>
        <Button variant="outline" onClick={() => navigate("/admin/perfumes")}>
          Back to Perfumes
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="perfumeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfume Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter perfume name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>URL to the perfume image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume (ml)*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="concentration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concentration*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select concentration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PerfumeConcentration).map(
                          ([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(TargetAudience).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter perfume description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter perfume ingredients"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel>Active</FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={submitting}>
              {submitting && <Spinner size="sm" className="mr-2" />}
              {isEditing ? "Update Perfume" : "Create Perfume"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ManagePerfumeDetailPage;
