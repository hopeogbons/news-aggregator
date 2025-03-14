import {
  TheGuardianSearchResponse,
  TheGuardianSectionsResponse,
  TheGuardianTagsResponse,
} from "./types";
import { requestApi } from "../../../utils";
import {
  API_KEY,
  THEGUARDIAN_SEARCH_V2,
  THEGUARDIAN_SECTIONS_V2,
  THEGUARDIAN_TAGS_V2,
} from "./constants";
import {
  extractTheGuardianAuthors,
  extractTheGuardianCategories,
  extractTheGuardianNews,
} from "./services";
import { NewsItem, NewsRetrieved } from "../../../redux/slices/newsSlice";

export const fetchTheGuardianCategories = async (): Promise<string[]> => {
  let theGuardianCategories: string[] = JSON.parse(
    localStorage.getItem("theGuardianCategories") || "[]"
  ) as string[];

  if (theGuardianCategories.length === 0) {
    try {
      const params: Record<string, string> = { "api-key": API_KEY };
      const data: TheGuardianSectionsResponse | null =
        await requestApi<TheGuardianSectionsResponse>(
          THEGUARDIAN_SECTIONS_V2,
          "GET",
          params
        );

      theGuardianCategories = extractTheGuardianCategories(
        data?.response.results ?? []
      );
      localStorage.setItem(
        "theGuardianCategories",
        JSON.stringify(theGuardianCategories)
      );
    } catch (error) {
      console.error("Error fetching The Guardian Categories: ", error);
      theGuardianCategories = [];
    }
  }

  return theGuardianCategories;
};

export const fetchTheGuardianAuthors = async (): Promise<string[]> => {
  let theGuardianAuthors: string[] = JSON.parse(
    localStorage.getItem("theGuardianAuthors") || "[]"
  ) as string[];

  if (theGuardianAuthors.length === 0) {
    try {
      const params: Record<string, string> = {
        type: "contributor",
        "api-key": API_KEY,
      };
      const data: TheGuardianTagsResponse | null =
        await requestApi<TheGuardianTagsResponse>(
          THEGUARDIAN_TAGS_V2,
          "GET",
          params
        );
      theGuardianAuthors = extractTheGuardianAuthors(
        data?.response?.results ?? []
      );
      localStorage.setItem(
        "theGuardianAuthors",
        JSON.stringify(theGuardianAuthors)
      );
    } catch (error) {
      console.error("Error fetching The Guardian Authors: ", error);
      theGuardianAuthors = [];
    }
  }

  return theGuardianAuthors;
};

export const fetchTheGuardianNews = async (
  queryParams: string = "world+news",
  newsRetrieved: NewsRetrieved
): Promise<NewsItem[]> => {
  let theGuardianNews: NewsItem[] = JSON.parse(
    localStorage.getItem("theGuardianNews") || "[]"
  ) as NewsItem[];

  if (theGuardianNews.length === 0) {
    try {
      const { newsPerPage, numberOfPages } = newsRetrieved;

      for (let page = 1; page <= newsPerPage; page++) {
        const url = `${THEGUARDIAN_SEARCH_V2}?q=${encodeURIComponent(
          queryParams
        )}&page-size=${numberOfPages}&page=${page}&api-key=${API_KEY}`;
        const response = await fetch(url);
        const data: TheGuardianSearchResponse = await response.json();
        theGuardianNews.push(
          ...extractTheGuardianNews(data?.response.results ?? [])
        );
      }

      localStorage.setItem("theGuardianNews", JSON.stringify(theGuardianNews));
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  }

  return theGuardianNews;
};
