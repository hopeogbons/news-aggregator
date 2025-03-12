import { NewYorkTimesSearch } from "./types";

export const extractNewYorkTimesAuthors = (
  articles: NewYorkTimesSearch[]
): string[] =>
  articles.reduce<string[]>(
    (authors: string[], article: NewYorkTimesSearch) => {
      if (article.byline?.original) {
        article.byline.original
          .replace(/^By\s+/i, "")
          .split(/\s*,\s*|\s+and\s+/)
          .forEach((name: string) => {
            const trimmedName: string = name.trim();
            if (trimmedName) authors.push(trimmedName);
          });
      }
      return authors;
    },
    []
  );

export const extractNewYorkTimesCategories = (
  articles: NewYorkTimesSearch[]
): string[] =>
  articles.reduce<string[]>(
    (categories: string[], article: NewYorkTimesSearch) => {
      if (article.section_name)
        categories.push(article.section_name.toLowerCase());
      return categories;
    },
    []
  );

export const extractNewYorkTimesKeywords = (
  articles: NewYorkTimesSearch[]
): string[] =>
  articles.reduce<string[]>(
    (keywords: string[], article: NewYorkTimesSearch) => {
      if (article.keywords) {
        article.keywords.forEach((keyword: { name: string; value: string }) => {
          if (keyword.value) {
            keywords.push(keyword.value);
          }
        });
      }
      return keywords;
    },
    []
  );
