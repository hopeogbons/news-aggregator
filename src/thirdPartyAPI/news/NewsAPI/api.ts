import { NewsApiEverythingResponse, NewsApiSourcesResponse } from "./types";
import {
  deduplicateRecords,
  delay,
  filterNewsArticles,
  getFromCache,
  requestApi,
  saveToCache,
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
import { NewsItem, NewsPageDetails } from "../../../redux/slices/newsSlice";

export const fetchNewsApiCategories = async (): Promise<string[]> => {
  let newsApiCategories: string[] = getFromCache("newsApiCategories", []);

  if (newsApiCategories.length === 0) {
    try {
      const params: Record<string, string> = { apiKey: API_KEY };
      const data = await requestApi<NewsApiSourcesResponse>(
        NEWSAPI_SOURCES_V2,
        "GET",
        params
      );

      const newsApiCategoriesMap: Record<string, string> =
        extractNewsApiCategories(data?.sources || []);
      newsApiCategories = deduplicateRecords(
        Object.values(newsApiCategoriesMap)
      );

      saveToCache("newsApiCategories", newsApiCategories);
      saveToCache("newsApiCategoriesMap", newsApiCategoriesMap);
    } catch (error) {
      console.error("Error fetching NewsAPI Categories: ", error);
      newsApiCategories = [];
    }
  }

  return newsApiCategories;
};

export const updateNewApiAuthors = (authors: string[]): void => {
  const cachedAuthors = getFromCache("newsApiAuthors", []);
  const combinedAuthors = validateRecords(
    deduplicateRecords([...cachedAuthors, ...authors]),
    (a: string) => !!a
  );
  saveToCache("newsApiAuthors", combinedAuthors);
};

export const fetchNewsApiAuthors = async (): Promise<string[]> => {
  let newsApiAuthors: string[] = getFromCache("newsApiAuthors", []);

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

      const extractedAuthors = validateRecords(
        Array.from(new Set(extractNewsApiAuthors(data?.articles || []))),
        (a: string) => !!a
      );

      saveToCache("newsApiAuthors", extractedAuthors);
      newsApiAuthors = extractedAuthors;
    } catch (error) {
      console.error("Error fetching NewsAPI Authors: ", error);
      newsApiAuthors = [];
    }
  }

  return newsApiAuthors;
};

export const fetchNewsApiNews = async (
  queryParams: string = "a",
  newsPageDetails: NewsPageDetails
): Promise<NewsItem[]> => {
  let newsApiNews: NewsItem[] = [];

  try {
    const newsApiCategoriesMap: Record<string, string> = getFromCache(
      "newsApiCategoriesMap",
      {}
    );
    let newsApiAuthors: string[] = [];

    const { newsPerPage, numberOfPages } = newsPageDetails;
    for (let page = 1; page <= newsPerPage; page++) {
      const params: Record<string, string> = {
        q: queryParams,
        pageSize: `${numberOfPages}`,
        page: `${page}`,
        apiKey: API_KEY,
      };
      await delay(1000);
      const data = await requestApi<NewsApiEverythingResponse>(
        NEWSAPI_EVERYTHING_V2,
        "GET",
        params
      );

      const newsAPI = extractNewsApiNews(
        data?.articles || [],
        newsApiCategoriesMap
      );

      newsApiNews.push(...newsAPI.news);
      newsApiAuthors.push(...newsAPI.authors);
    }

    updateNewApiAuthors(newsApiAuthors);

    newsApiNews = filterNewsArticles(
      newsApiNews,
      getFromCache("selectedCategories", []),
      getFromCache("selectedAuthors", [])
    );
  } catch (error) {
    console.error("Failed to fetch NewsAPI news:", error);
    newsApiNews = [];
  }

  return newsApiNews;
};
