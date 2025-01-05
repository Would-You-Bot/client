import z from "zod";

export const welcomeEmbedSchema = z.object({
  title: z
    .string()
    .min(4, "Make sure your title is at least 4 characters long")
    .max(100, "Make sure your title is only 100 characters long"),
  description: z
    .string()
    .min(10, "Make sure your description is at least 10 characters long")
    .max(150, "Make sure your description is only 150 characters long"),
  author: z.object({
    name: z
      .string()
      .min(4, "Make sure your author name is at least 4 characters long")
      .max(100, "Make sure your author name is only 100 characters long"),
    url: z.string().url().optional(),
    iconURL: z.string().url().optional(),
  }),
  thumbnail: z.string().url().optional(),
  image: z.string().url().optional(),
  footer: z.object({
    text: z
      .string()
      .min(4, "Make sure your footer text is at least 4 characters long")
      .max(100, "Make sure your footer text is only 100 characters long"),
    iconURL: z.string().url().optional(),
  }),
  color: z.string().optional(),
  timestamp: z.string().optional(),
  content: z.string().optional(),
});

export type EmbedData = z.infer<typeof welcomeEmbedSchema>;
