import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { useAuth } from "@/contexts/auth.context";

// Login schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
});

// Registration schema
const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    YOB: z
      .string()
      .refine((val) => !isNaN(parseInt(val, 10)), {
        message: "Year of birth must be a valid number",
      })
      .refine(
        (val) => {
          const year = parseInt(val, 10);
          const currentYear = new Date().getFullYear();
          return year >= 1900 && year <= currentYear;
        },
        { message: "Please enter a valid year of birth" }
      ),
    gender: z.string().refine((val) => val === "true" || val === "false", {
      message: "Please select a gender",
    }),
    password: z
      .string()
      .min(4, { message: "Password must be at least 4 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthenticationFormProps {
  mode: "login" | "register";
}

const AuthenticationForm = ({ mode }: AuthenticationFormProps) => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form for login - properly configured to preserve values after errors
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form for register - properly configured to preserve values after errors
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      YOB: "",
      gender: "true",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);

    const { email, password } = values;

    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      // Show the error message from the server if available
      toast.error(
        error.response?.data?.errors[0]?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle register form submission
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    const userData = {
      email: values.email,
      name: values.name,
      YOB: parseInt(values.YOB),
      gender: values.gender === "true", // Convert string to boolean
      password: values.password,
    };

    try {
      await signup(userData);
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.errors[0]?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {mode === "login"
            ? "Sign in to access your account"
            : "Fill in the details to create your new account"}
        </p>
      </div>

      {mode === "login" ? (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="space-y-6"
            noValidate
          >
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="YOB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of birth</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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

            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
      )}

      <div className="mt-4 text-center text-sm">
        {mode === "login" ? (
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Register here
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthenticationForm;
