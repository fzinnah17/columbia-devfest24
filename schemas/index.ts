import * as z from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  profilePicUrl: z.string().optional(),
});

export const formSchema = z.object({
  content: z.string().refine(
    (value) => {
      const trimmedValue = value.trim();
      return trimmedValue.length >= 1;
    },
    { message: "Post cannot be empty" },
  ),
  image: z.string().optional(),
});