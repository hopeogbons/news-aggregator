import { NewsItem } from "../../../redux/slices/newsSlice";
import { NewsApiArticle, NewsApiSource } from "./types";

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const extractNewsApiAuthors = (articles: NewsApiArticle[]): string[] => {
  if (!articles) return [];

  return articles
    .map((article: NewsApiArticle) => article?.author)
    .filter((author): author is string => !!author);
};

export const extractNewsApiCategories = (
  sources: NewsApiSource[]
): Record<string, string> => {
  if (!sources) return { general: "General" };

  return sources.reduce(
    (categories: Record<string, string>, source: NewsApiSource) => {
      const sourceId = source?.id?.trim().toLowerCase() || "unknown";
      const category = source?.category || "general";
      const sourceCategory = capitalize(category);
      categories[sourceId] = sourceCategory;
      return categories;
    },
    { general: "General" }
  );
};

export const extractNewsApiNews = (
  articles: NewsApiArticle[],
  newsApiCategoriesMap: Record<string, string>
): { news: NewsItem[]; authors: string[] } => {
  if (!articles) return { news: [], authors: [] };

  const newsApi: { news: NewsItem[]; authors: string[] } = {
    news: [],
    authors: [],
  };

  articles.map((item) => {
    const author: string = item?.author || "Unknown";

    newsApi.news.push({
      title: item?.title || "",
      description: item?.description || "",
      url: item?.url || "#",
      source: "NewsAPI",
      publishedAt: item?.publishedAt || "",
      category: newsApiCategoriesMap[item?.source?.id || "general"],
      author,
      thumbnail: item?.urlToImage || "",
    });

    newsApi.authors.push(author);
  });

  return newsApi;
};
