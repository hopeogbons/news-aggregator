import { NewsItem } from "../../../redux/slices/newsSlice";
import { NewsApiArticle, NewsApiSource } from "./types";

export const extractNewsApiAuthors = (articles: NewsApiArticle[]): string[] =>
  articles.reduce<string[]>((authors: string[], article: NewsApiArticle) => {
    if (article.author) {
      authors.push(article.author);
    }
    return authors;
  }, []);

export const extractNewsApiCategories = (
  sources: NewsApiSource[]
): Record<string, string> =>
  sources.reduce(
    (categories: Record<string, string>, source: NewsApiSource) => {
      const sourceId = source?.id?.trim().toLowerCase() ?? "unknown";
      const category = source?.category ?? "general";
      const sourceCategory = `${category.at(0)?.toUpperCase()}${category.slice(
        1
      )}`;
      categories[sourceId] = sourceCategory;
      return categories;
    },
    { general: "General" }
  );

export const extractNewsApiNews = (
  articles: NewsApiArticle[],
  newsApiCategoriesMap: Record<string, string>
): NewsItem[] => {
  return articles.map((item) => {
    return {
      title: item?.title ?? "",
      description: item?.description ?? "",
      url: item?.url ?? "#",
      source: "NewsAPI",
      publishedAt: item?.publishedAt ?? "",
      category: newsApiCategoriesMap[item?.source?.id ?? "general"],
      author: item?.author ?? "Unknown",
      thumbnail: item?.urlToImage ?? "",
    };
  });
};
