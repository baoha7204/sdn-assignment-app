import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import userApi from "@/api/user.api";
import { User } from "@/contexts/auth.context";

const currentYear = new Date().getFullYear();

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  YOB: z.coerce
    .number()
    .min(1900, "Year must be 1900 or later")
    .max(currentYear, `Year must not exceed ${currentYear}`),
  gender: z.string().refine((data) => {
    return data === "true" || data === "false";
  }),
});

export type ProfileInputs = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User | null;
  updateProfile: (user: ProfileInputs) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, updateProfile }) => {
  const form = useForm<ProfileInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      YOB: user?.YOB || 2000,
      gender: user?.gender.toString() || "true",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (submitData: z.infer<typeof profileSchema>) => {
    setIsSubmitting(true);
    try {
      const data = await userApi.updateProfile(submitData);
      updateProfile({
        name: data.name,
        YOB: data.YOB,
        gender: data.gender,
      });

      toast.success("Your profile information has been updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.errors[0]?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="YOB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year of Birth</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="1900" max={currentYear} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Male</SelectItem>
                  <SelectItem value="false">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
