import { NewsItem } from "../../../redux/slices/newsSlice";
import {
  TheGuardianSection,
  TheGuardianArticle,
  TheGuardianTag,
} from "./types";

export const extractTheGuardianAuthors = (tags: TheGuardianTag[]): string[] => {
  const authors: string[] = [];

  tags.forEach((tag: TheGuardianTag) => {
    if (tag.type === "contributor" && tag.webTitle) {
      tag.webTitle.split(/\s*,\s*|\s+and\s+/i).forEach((name: string) => {
        const trimmedName = name.trim();
        if (trimmedName && !authors.includes(trimmedName)) {
          authors.push(trimmedName);
        }
      });
    }
  });

  return authors;
};

export const extractTheGuardianCategories = (
  sections: TheGuardianSection[]
): Record<string, string> =>
  sections.reduce(
    (categories: Record<string, string>, section: TheGuardianSection) => {
      const sectionId: string = section?.id?.trim().toLowerCase() ?? "unknown";
      const sectionCategory: string = section?.webTitle ?? "Unknown";
      categories[sectionId] = sectionCategory;
      return categories;
    },
    {}
  );

export const extractTheGuardianNews = (
  articles: TheGuardianArticle[]
): NewsItem[] => {
  return articles.map((item) => ({
    title: item?.webTitle ?? "",
    description: item?.fields?.trailText ?? "",
    url: item?.webUrl ?? "#",
    source: "The Guardian",
    publishedAt: item?.webPublicationDate ?? "",
    category: item?.sectionName ?? "General",
    author: item?.fields?.byline ?? "Unknown",
    thumbnail: item?.fields?.thumbnail ?? "",
  }));
};
