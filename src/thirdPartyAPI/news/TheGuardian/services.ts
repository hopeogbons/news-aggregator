import { PREFERRED_CATEGORIES } from "./constants";
import { TheGuardianArticle, TheGuardianSection } from "./types";

export const extractTheGuardianAuthors = (
  articles: TheGuardianArticle[]
): string[] =>
  articles.reduce<string[]>(
    (authors: string[], article: TheGuardianArticle) => {
      if (article.fields?.byline) {
        article.fields.byline
          .split(/\s*,\s*|\s+and\s+/)
          .forEach((name: string) => {
            const trimmedName: string = name.trim();
            if (trimmedName) authors.push(trimmedName);
          });
      }

      article.tags?.forEach(
        (tag: { webTitle: string | null; type: string }) => {
          if (tag.type === "contributor" && tag.webTitle) {
            tag.webTitle.split(/\s*,\s*|\s+and\s+/).forEach((name: string) => {
              const trimmedName: string = name.trim();
              if (trimmedName) authors.push(trimmedName);
            });
          }
        }
      );

      return authors;
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
