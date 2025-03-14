import { NewYorkTimesSearchResponse } from "./types";
import { requestApi } from "../../../utils";
import { API_KEY, NEWYORKTIMES_SEARCH_V2 } from "./constants";
import {
  extractNewYorkTimesAuthors,
  extractNewYorkTimesCategories,
  extractNewYorkTimesNews,
} from "./services";
import { NewsItem, NewsRetrieved } from "../../../redux/slices/newsSlice";

export const fetchNewYorkTimesCategories = async (): Promise<string[]> => {
  let newYorkTimesCategories: string[] = JSON.parse(
    localStorage.getItem("newYorkTimesCategories") || "[]"
  ) as string[];

  if (newYorkTimesCategories.length === 0) {
    try {
      const params: Record<string, string> = { "api-key": API_KEY };
      const data: NewYorkTimesSearchResponse | null =
        await requestApi<NewYorkTimesSearchResponse>(
          NEWYORKTIMES_SEARCH_V2,
          "GET",
          params
        );

      newYorkTimesCategories = extractNewYorkTimesCategories(
        data?.response?.docs ?? []
      );
      localStorage.setItem(
        "newYorkTimesCategories",
        JSON.stringify(newYorkTimesCategories)
      );
    } catch (error) {
      console.error("Error fetching New York Times Categories: ", error);
      newYorkTimesCategories = [];
    }
  }

  return newYorkTimesCategories;
};

export const fetchNewYorkTimesAuthors = async (): Promise<string[]> => {
  let newYorkTimesAuthors: string[] = JSON.parse(
    localStorage.getItem("newYorkTimesAuthors") || "[]"
  ) as string[];

  if (newYorkTimesAuthors.length === 0) {
    try {
      const params: Record<string, string> = {
        q: "world news",
        "api-key": API_KEY,
      };
      const data: NewYorkTimesSearchResponse | null =
        await requestApi<NewYorkTimesSearchResponse>(
          NEWYORKTIMES_SEARCH_V2,
          "GET",
          params
        );

      newYorkTimesAuthors = extractNewYorkTimesAuthors(
        data?.response.docs ?? []
      );

      localStorage.setItem(
        "newYorkTimesAuthors",
        JSON.stringify(newYorkTimesAuthors)
      );
    } catch (error) {
      console.error("Error fetching New York Times Authors: ", error);
      newYorkTimesAuthors = [];
    }
  }

  return newYorkTimesAuthors;
};

export const fetchNewYorkTimesNews = async (
  queryParams: string = "world+news",
  newsRetrieved: NewsRetrieved
): Promise<NewsItem[]> => {
  let newYorkTimesNews: NewsItem[] = JSON.parse(
    localStorage.getItem("newYorkTimesNews") || "[]"
  ) as NewsItem[];

  if (newYorkTimesNews.length === 0) {
    try {
      const { newsPerPage, numberOfPages } = newsRetrieved;

      for (let page = 1; page <= newsPerPage; page++) {
        const url = `${NEWYORKTIMES_SEARCH_V2}?q=${encodeURIComponent(
          queryParams
        )}&page-size=${numberOfPages}&page=${page - 1}&api-key=${API_KEY}`;
        const response = await fetch(url);
        const data: NewYorkTimesSearchResponse = await response.json();
        newYorkTimesNews.push(
          ...extractNewYorkTimesNews(data?.response?.docs ?? [])
        );
      }

      localStorage.setItem(
        "newYorkTimesNews",
        JSON.stringify(newYorkTimesNews)
      );
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  }

  return newYorkTimesNews;
};
