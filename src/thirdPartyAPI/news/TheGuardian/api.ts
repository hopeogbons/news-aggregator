import {
  TheGuardianSearchResponse,
  TheGuardianSectionsResponse,
  TheGuardianTagsResponse,
} from "./types";
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
  THEGUARDIAN_SEARCH_V2,
  THEGUARDIAN_SECTIONS_V2,
  THEGUARDIAN_TAGS_V2,
} from "./constants";
import {
  extractTheGuardianAuthors,
  extractTheGuardianCategories,
  extractTheGuardianNews,
} from "./services";
import { NewsItem, NewsPageDetails } from "../../../redux/slices/newsSlice";

export const fetchTheGuardianCategories = async (): Promise<string[]> => {
  let theGuardianCategories: string[] = getFromCache(
    "theGuardianCategories",
    []
  );

  if (theGuardianCategories.length === 0) {
    try {
      const params: Record<string, string> = { "api-key": API_KEY };
      const data = await requestApi<TheGuardianSectionsResponse>(
        THEGUARDIAN_SECTIONS_V2,
        "GET",
        params
      );

      const theGuardianCategoriesMap = extractTheGuardianCategories(
        data?.response?.results || []
      );
      theGuardianCategories = Object.values(theGuardianCategoriesMap);

      saveToCache("theGuardianCategories", theGuardianCategories);
    } catch (error) {
      console.error("Error fetching The Guardian Categories: ", error);
      theGuardianCategories = [];
    }
  }

  return theGuardianCategories;
};

export const updateTheGuardianAuthors = (authors: string[]): void => {
  const cachedAuthors = getFromCache("theGuardianAuthors", []);
  const combinedAuthors = validateRecords(
    deduplicateRecords([...cachedAuthors, ...authors]),
    (a: string) => !!a
  );
  saveToCache("theGuardianAuthors", combinedAuthors);
};

export const fetchTheGuardianAuthors = async (): Promise<string[]> => {
  let theGuardianAuthors: string[] = getFromCache("theGuardianAuthors", []);

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
        data?.response?.results || []
      );
      saveToCache("theGuardianAuthors", theGuardianAuthors);
    } catch (error) {
      console.error("Error fetching The Guardian Authors: ", error);
      theGuardianAuthors = [];
    }
  }

  return theGuardianAuthors;
};

export const fetchTheGuardianNews = async (
  queryParams: string = "a",
  newsPageDetails: NewsPageDetails
): Promise<NewsItem[]> => {
  let theGuardianNews: NewsItem[] = [];

  try {
    const { newsPerPage, numberOfPages } = newsPageDetails;
    let theGuardianAuthors: string[] = [];

    for (let page = 1; page <= newsPerPage; page++) {
      const params: Record<string, string> = {
        q: queryParams,
        "show-tags": "contributor",
        "show-fields": "headline,trailText,byline,thumbnail",
        page: `${page}`,
        "page-size": `${numberOfPages}`,
        "api-key": API_KEY,
      };
      await delay(1000);
      const data = await requestApi<TheGuardianSearchResponse>(
        THEGUARDIAN_SEARCH_V2,
        "GET",
        params
      );

      const theGuardian = extractTheGuardianNews(data?.response?.results || []);

      theGuardianNews.push(...theGuardian.news);
      theGuardianAuthors.push(...theGuardian.authors);
    }

    updateTheGuardianAuthors(theGuardianAuthors);

    theGuardianNews = filterNewsArticles(
      theGuardianNews,
      getFromCache("selectedCategories", []),
      getFromCache("selectedAuthors", [])
    );
  } catch (error) {
    console.error("Failed to fetch The Guardian news:", error);
    theGuardianNews = [];
  }

  return theGuardianNews;
};
