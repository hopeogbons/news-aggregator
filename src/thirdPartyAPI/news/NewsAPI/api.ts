import { NewsApiEverythingResponse, NewsApiSourcesResponse } from "./types";
import { requestApi } from "../../../utils";
import {
  API_KEY,
  NEWSAPI_EVERYTHING_V2,
  NEWSAPI_SOURCES_V2,
} from "./constants";
import { extractNewsApiAuthors, extractNewsApiCategories } from "./services";

export const fetchNewsApiCategories = async (): Promise<string[]> => {
  let newsApiCategories: string[] = JSON.parse(
    localStorage.getItem("newsApiCategories") || "[]"
  ) as string[];

  if (newsApiCategories.length === 0) {
    try {
      const params: Record<string, string> = { apiKey: API_KEY };
      const data: NewsApiSourcesResponse | null =
        await requestApi<NewsApiSourcesResponse>(
          NEWSAPI_SOURCES_V2,
          "GET",
          params
        );

      newsApiCategories = extractNewsApiCategories(data?.sources ?? []);

      localStorage.setItem(
        "newsApiCategories",
        JSON.stringify(newsApiCategories)
      );
    } catch (error) {
      console.error("Error fetching NewsAPI Categories: ", error);
      newsApiCategories = [];
    }
  }

  return newsApiCategories;
};

export const fetchNewsApiAuthors = async (): Promise<string[]> => {
  let newsApiAuthors: string[] = JSON.parse(
    localStorage.getItem("newsApiAuthors") || "[]"
  ) as string[];

  if (newsApiAuthors.length === 0) {
    try {
      const params: Record<string, string> = {
        q: "example",
        apiKey: API_KEY,
      };
      const data: NewsApiEverythingResponse | null =
        await requestApi<NewsApiEverythingResponse>(
          NEWSAPI_EVERYTHING_V2,
          "GET",
          params
        );

      newsApiAuthors = extractNewsApiAuthors(data?.articles ?? []);

      localStorage.setItem("newsApiAuthors", JSON.stringify(newsApiAuthors));
    } catch (error) {
      console.error("Error fetching NewsAPI Authors: ", error);
      newsApiAuthors = [];
    }
  }

  return newsApiAuthors;
};
