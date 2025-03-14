import { NewsItem } from "../../../redux/slices/newsSlice";
import { PREFERRED_CATEGORIES } from "./constants";
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
): string[] =>
  sections.reduce<string[]>(
    (categories: string[], section: TheGuardianSection) => {
      if (!PREFERRED_CATEGORIES || PREFERRED_CATEGORIES.includes(section.id)) {
        categories.push(section.id);
      }
      return categories;
    },
    []
  );

export const extractTheGuardianKeywords = (
  articles: TheGuardianArticle[]
): string[] =>
  articles.reduce<string[]>(
    (keywords: string[], article: TheGuardianArticle) => {
      article.tags.forEach((tag: { webTitle: string | null; type: string }) => {
        if (tag.webTitle) {
          keywords.push(tag.webTitle);
        }
      });
      return keywords;
    },
    []
  );

export const extractTheGuardianNews = (
  articles: TheGuardianArticle[]
): NewsItem[] => {
  return articles.map((item) => ({
    title: item.webTitle,
    description: item.fields?.trailText || "",
    url: item.webUrl,
    source: "The Guardian",
    publishedAt: item.webPublicationDate,
    category: item.sectionName || "General",
    author: item.fields?.byline || "Unknown",
    thumbnail: item.fields?.thumbnail || "",
  }));
};
