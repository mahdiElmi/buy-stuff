import * as z from "zod";
export const vendorSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(33, {
      message: "name can't be more than 33 characters.",
    }),
  description: z
    .string()
    .min(5, { message: "description must be at least 5 characters" })
    .max(330, {
      message: "description can't be more than 330 characters.",
    }),
  image: z.string().trim().optional(),
  bannerImage: z.string().trim().optional(),
});

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, { message: "product name can't more than 100 characters" })
    .min(3, { message: "must be at least 3 characters long" }),
  description: z.string().trim().max(1000),
  categories: z.string().refine(
    (category) => {
      const allowedCategories = ["Clothes", "Electronics"];
      return allowedCategories.includes(category);
    },
    {
      message: "Category is invalid.",
    },
  ),
  price: z.coerce.number().finite().nonnegative().max(1000000),
  stock: z.coerce.number().finite().positive(),
  imgUrls: z
    .array(z.string())
    .min(1, "Must upload at least one Image.")
    .max(5, "Can't upload more than 5 images"),
});

export const ReviewSchema = z.object({
  rating: z.number().int().min(1, { message: "Rating is empty" }).max(5),
  title: z.string().trim().min(1, { message: "Title is empty." }).max(100),
  body: z
    .string()
    .trim()
    .min(3, { message: "Review must be at least 3 characters long." })
    .max(5000, { message: "Review can't be longer than 5000 characters." }),
});

export const profileSchema = z.object({
  username: z.string().trim().toLowerCase(),
  firstName: z.string().trim().toLowerCase(),
  lastName: z.string().trim().toLowerCase(),
  image: z.string().trim(),
});
