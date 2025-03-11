import { NewsApiSource, NewsApiSourceResponse } from "./types";
import { NewsApiArticle, NewsApiArticleResponse } from "./types";
import {
  API_KEY,
  EVERYTHING_URL_V2,
  TOP_HEADLINES_SOURCES_URL_V2,
} from "./constants";
import { requestApi } from "../../../utils";

export const fetchNewsApiCategories = async (): Promise<NewsApiSource[]> => {
  const data = await requestApi<NewsApiSourceResponse>(
    TOP_HEADLINES_SOURCES_URL_V2,
    "GET",
    { apiKey: API_KEY },
    "Failed to fetch NewsAPI categories"
  );

  return data?.sources ?? [];
};

export const fetchNewsApiArticles = async (
  query?: string
): Promise<NewsApiArticle[]> => {
  const params: Record<string, string> = {
    sortBy: "relevancy",
    "api-key": API_KEY,
    apiKey: API_KEY,
  };
  if (query) params.q = query;
  const data: NewsApiArticleResponse | null =
    await requestApi<NewsApiArticleResponse>(
      EVERYTHING_URL_V2,
      "GET",
      params,
      "Failed to fetch NewsAPI articles"
    );

  return data?.articles ?? [];
};

// reserved for complex general queries
/*const categoryQuery: string = categories
    .map((category) => `"${category}"`)
    .join(" OR ");
  const authorQuery: string = authors
    .map((author) => `"${author}"`)
    .join(" OR ");
  const query: string = `(${categoryQuery}) AND (${authorQuery})`;*/
