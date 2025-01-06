import z from "zod";

const welcomeEmbedSchema = z.object({
  title: z
    .string()
    .min(3, "Make sure your title is at least 3 characters long")
    .max(100, "Make sure your title is only 100 characters long")
    .optional(),
  titleURL: z.string().url().optional(),
  description: z
    .string()
    .min(3, "Make sure your description is at least 3 characters long")
    .max(350, "Make sure your description is only 150 characters long"),
  author: z.object({
    name: z
      .string()
      .min(3, "Make sure your author name is at least 3 characters long")
      .max(100, "Make sure your author name is only 100 characters long"),
    url: z.string().url(),
  }),
  thumbnail: z.string().url().optional(),
  image: z.string().url().optional(),
  footer: z.object({
    text: z
      .string()
      .min(3, "Make sure your footer text is at least 3 characters long")
      .max(100, "Make sure your footer text is only 100 characters long"),
    iconURL: z.string().url(),
  }),
  color: z
    .string()
    .refine((value) => /\#([0-9a-f]{3}){1,2}\b/gi.test(value), {
      message: "Make sure your color is a valid hex color; ex: #338EB8",
    })
    .optional(),
  timestamp: z.boolean().optional(),
  content: z
    .string()
    .min(3, "Make sure your content is at least 3 characters long")
    .max(400, "Make sure your content is only 400 characters long")
    .optional(),
});

export function welcomeEmbed({
  guildDb,
  title = guildDb.welcomeEmbedTitle || "aaa",
  titleURL = guildDb.welcomeEmbedTitleURL || "aaa",
  description = guildDb.welcomeEmbedDescription || "aaa",
  author = guildDb.welcomeEmbedAuthor || "aaa",
  authorURL = guildDb.welcomeEmbedAuthorURL ||
    "https://i.imgur.com/lEy6WEe.jpeg",
  thumbnail = guildDb.welcomeEmbedThumbnail ||
    "https://i.imgur.com/lEy6WEe.jpeg",
  image = guildDb.welcomeEmbedImage || "https://i.imgur.com/lEy6WEe.jpeg",
  footer = guildDb.welcomeEmbedFooter || "aaa",
  footerURL = guildDb.welcomeEmbedFooterURL ||
    "https://i.imgur.com/eWrz6Qi.jpeg",
  color = guildDb.welcomeEmbedColor || "#ffffff",
  timestamp = guildDb.welcomeEmbedTimestamp || false,
  content = guildDb.welcomeEmbedContent || "aaa",
}: {
  guildDb: any;
  title?: string;
  titleURL?: string;
  description?: string;
  author?: string;
  authorURL?: string;
  thumbnail?: string;
  image?: string;
  footer?: string;
  footerURL?: string;
  color?: string;
  timestamp?: boolean;
  content?: string;
}) {
  return welcomeEmbedSchema.safeParse({
    title: title,
    titleURL: titleURL,
    description: description,
    author: {
      name: author,
      url: authorURL,
    },
    thumbnail: thumbnail,
    image: image,
    footer: {
      text: footer,
      iconURL: footerURL,
    },
    color: color,
    timestamp: timestamp,
    content: content,
  });
}
