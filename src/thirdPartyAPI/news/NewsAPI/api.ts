import { NewsApiEverythingResponse, NewsApiSourcesResponse } from "./types";
import {
  deduplicateRecords,
  requestApi,
  validateRecords,
} from "../../../utils";
import {
  API_KEY,
  NEWSAPI_EVERYTHING_V2,
  NEWSAPI_SOURCES_V2,
} from "./constants";
import {
  extractNewsApiAuthors,
  extractNewsApiCategories,
  extractNewsApiNews,
} from "./services";
import { NewsItem, NewsRetrieved } from "../../../redux/slices/newsSlice";

export const fetchNewsApiCategories: () => Promise<{
  newsApiCategories: string[];
  newsApiCategoriesMap: Record<string, string>;
}> = async () => {
  let newsApiCategories: string[] = JSON.parse(
    localStorage.getItem("newsApiCategories") || "[]"
  ) as string[];
  let newsApiCategoriesMap: Record<string, string> = JSON.parse(
    localStorage.getItem("newsApiCategoriesMap") || "{}"
  ) as Record<string, string>;

  if (newsApiCategories.length === 0) {
    try {
      const params: Record<string, string> = { apiKey: API_KEY };
      const data = await requestApi<NewsApiSourcesResponse>(
        NEWSAPI_SOURCES_V2,
        "GET",
        params
      );

      newsApiCategoriesMap = extractNewsApiCategories(data?.sources ?? []);
      newsApiCategories = deduplicateRecords(
        Object.values(newsApiCategoriesMap)
      );
      localStorage.setItem(
        "newsApiCategoriesMap",
        JSON.stringify(newsApiCategoriesMap)
      );
      localStorage.setItem(
        "newsApiCategories",
        JSON.stringify(newsApiCategories)
      );
    } catch (error) {
      console.error("Error fetching NewsAPI Categories: ", error);
      newsApiCategories = [];
      newsApiCategoriesMap = {};
    }
  }

  return { newsApiCategories, newsApiCategoriesMap };
};

export const fetchNewsApiAuthors = async (): Promise<string[]> => {
  let newsApiAuthors: string[] = JSON.parse(
    localStorage.getItem("newsApiAuthors") || "[]"
  ) as string[];

  if (newsApiAuthors.length === 0) {
    try {
      const params: Record<string, string> = {
        q: "world+news",
        apiKey: API_KEY,
      };
      const data = await requestApi<NewsApiEverythingResponse>(
        NEWSAPI_EVERYTHING_V2,
        "GET",
        params
      );

      const newsApiAuthors = validateRecords(
        Array.from(new Set(extractNewsApiAuthors(data?.articles ?? []))),
        (a: string) => !!a
      );

      localStorage.setItem("newsApiAuthors", JSON.stringify(newsApiAuthors));
    } catch (error) {
      console.error("Error fetching NewsAPI Authors: ", error);
      newsApiAuthors = [];
    }
  }

  return newsApiAuthors;
};

export const fetchNewsApiNews = async (
  queryParams: string = "a",
  newsRetrieved: NewsRetrieved
): Promise<NewsItem[]> => {
  let newsApiNews: NewsItem[] = JSON.parse(
    localStorage.getItem("newsApiNews") || "[]"
  ) as NewsItem[];

  if (newsApiNews.length === 0) {
    try {
      let newsApiCategoriesMap: Record<string, string> = JSON.parse(
        localStorage.getItem("newsApiCategoriesMap") || "{}"
      ) as Record<string, string>;

      const { newsPerPage, numberOfPages } = newsRetrieved;

      for (let page = 1; page <= newsPerPage; page++) {
        const params: Record<string, string> = {
          q: queryParams,
          pageSize: `${numberOfPages}`,
          page: `${page}`,
          apiKey: API_KEY,
        };
        const data = await requestApi<NewsApiEverythingResponse>(
          NEWSAPI_EVERYTHING_V2,
          "GET",
          params
        );
        newsApiNews.push(
          ...extractNewsApiNews(data?.articles ?? [], newsApiCategoriesMap)
        );
      }

      localStorage.setItem("newsApiNews", JSON.stringify(newsApiNews));
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  }

  return newsApiNews;
};
