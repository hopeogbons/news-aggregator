import { NewsItem } from "../../../redux/slices/newsSlice";
import { NewYorkTimesArticle } from "./types";

export const extractNewYorkTimesAuthors = (
  articles: NewYorkTimesArticle[]
): string[] =>
  articles.reduce<string[]>(
    (authors: string[], article: NewYorkTimesArticle) => {
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
  articles: NewYorkTimesArticle[]
): string[] =>
  articles.reduce<string[]>(
    (categories: string[], article: NewYorkTimesArticle) => {
      if (article.section_name)
        categories.push(article.section_name.toLowerCase());
      return categories;
    },
    []
  );

export const extractNewYorkTimesKeywords = (
  articles: NewYorkTimesArticle[]
): string[] =>
  articles.reduce<string[]>(
    (keywords: string[], article: NewYorkTimesArticle) => {
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

export const extractNewYorkTimesNews = (
  articles: NewYorkTimesArticle[]
): NewsItem[] => {
  return articles.map((item) => ({
    title: item.headline.main,
    description: item.abstract || "",
    url: item.web_url,
    source: "New York Times",
    publishedAt: item.pub_date,
    category: item.section_name,
    author: item.byline?.original || "Unknown",
    thumbnail: item.multimedia[0]?.url || "",
  }));
};
