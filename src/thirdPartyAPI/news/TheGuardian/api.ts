import {
  TheGuardianSearchResponse,
  TheGuardianSectionsResponse,
  TheGuardianTagsResponse,
} from "./types";
import { requestApi, validateRecords } from "../../../utils";
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

export const fetchTheGuardianCategories: () => Promise<{
  theGuardianCategories: string[];
  theGuardianCategoriesMap: Record<string, string>;
}> = async () => {
  let theGuardianCategories: string[] = JSON.parse(
    localStorage.getItem("theGuardianCategories") || "[]"
  ) as string[];
  let theGuardianCategoriesMap: Record<string, string> = JSON.parse(
    localStorage.getItem("theGuardianCategoriesMap") || "[]"
  ) as Record<string, string>;

  if (theGuardianCategories.length === 0) {
    try {
      const params: Record<string, string> = { "api-key": API_KEY };
      const data = await requestApi<TheGuardianSectionsResponse>(
        THEGUARDIAN_SECTIONS_V2,
        "GET",
        params
      );

      theGuardianCategoriesMap = extractTheGuardianCategories(
        data?.response?.results ?? []
      );
      theGuardianCategories = Object.values(theGuardianCategoriesMap);

      localStorage.setItem(
        "theGuardianCategoriesMap",
        JSON.stringify(theGuardianCategoriesMap)
      );
      localStorage.setItem(
        "theGuardianCategories",
        JSON.stringify(theGuardianCategories)
      );
    } catch (error) {
      console.error("Error fetching The Guardian Categories: ", error);
      theGuardianCategories = [];
      theGuardianCategoriesMap = {};
    }
  }

  return { theGuardianCategories, theGuardianCategoriesMap };
};

export const fetchTheGuardianAuthors = async (): Promise<string[]> => {
  let theGuardianAuthors: string[] = JSON.parse(
    localStorage.getItem("theGuardianAuthors") || "[]"
  ) as string[];

  if (theGuardianAuthors.length === 0) {
    try {
      const params: Record<string, string> = {
        type: "contributor",
        "show-fields": "all",
        "api-key": API_KEY,
      };
      const data = await requestApi<TheGuardianTagsResponse>(
        THEGUARDIAN_TAGS_V2,
        "GET",
        params
      );

      const theGuardianAuthors = validateRecords(
        Array.from(
          new Set(extractTheGuardianAuthors(data?.response?.results ?? []))
        ),
        (a: string) => !!a
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
  queryParams: string = "a",
  newsRetrieved: NewsRetrieved
): Promise<NewsItem[]> => {
  let theGuardianNews: NewsItem[] = JSON.parse(
    localStorage.getItem("theGuardianNews") || "[]"
  ) as NewsItem[];

  if (theGuardianNews.length === 0) {
    try {
      const { newsPerPage, numberOfPages } = newsRetrieved;

      for (let page = 1; page <= newsPerPage; page++) {
        const params: Record<string, string> = {
          q: queryParams,
          "page-size": `${numberOfPages}`,
          page: `${page}`,
          "show-fields": "all",
          "api-key": API_KEY,
        };
        const data = await requestApi<TheGuardianSearchResponse>(
          THEGUARDIAN_SEARCH_V2,
          "GET",
          params
        );
        theGuardianNews.push(
          ...extractTheGuardianNews(data?.response?.results ?? [])
        );
      }

      localStorage.setItem("theGuardianNews", JSON.stringify(theGuardianNews));
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  }

  return theGuardianNews;
};
