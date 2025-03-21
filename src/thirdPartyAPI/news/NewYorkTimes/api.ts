import {
  NewYorkTimesSearchResponse,
  NewYorkTimesSectionsResponse,
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
  NEWYORKTIMES_SEARCH_V2,
  NEWYORKTIMES_SECTION_V3,
} from "./constants";
import {
  extractNewYorkTimesAuthors,
  extractNewYorkTimesCategories,
  extractNewYorkTimesNews,
} from "./services";
import { NewsItem, NewsRetrieved } from "../../../redux/slices/newsSlice";

export const fetchNewYorkTimesCategories = async (): Promise<string[]> => {
  let newYorkTimesCategories: string[] = getFromCache(
    "newYorkTimesCategories",
    []
  );

  if (newYorkTimesCategories.length === 0) {
    try {
      const params: Record<string, string> = {
        "api-key": API_KEY,
      };
      const data = await requestApi<NewYorkTimesSectionsResponse>(
        NEWYORKTIMES_SECTION_V3,
        "GET",
        params
      );

      const newYorkTimesCategoriesMap = extractNewYorkTimesCategories(
        data?.results || []
      );
      newYorkTimesCategories = Object.values(newYorkTimesCategoriesMap);

      saveToCache("newYorkTimesCategories", newYorkTimesCategories);
    } catch (error) {
      console.error("Error fetching New York Times Categories: ", error);
      newYorkTimesCategories = [];
    }
  }

  return newYorkTimesCategories;
};

export const updateNewYorkTimesAuthors = (authors: string[]): void => {
  const existingAuthors = getFromCache("newYorkTimesAuthors", []);
  const updatedAuthors = validateRecords(
    deduplicateRecords([...existingAuthors, ...authors]),
    (a: string) => !!a
  );

  saveToCache("newYorkTimesAuthors", updatedAuthors);
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
        data?.response.docs || []
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
  let newYorkTimesNews: NewsItem[] = [];

  try {
    const { newsPerPage, numberOfPages } = newsRetrieved;
    let newYorkTimesAuthors: string[] = [];

    for (let page = 1; page <= newsPerPage; page++) {
      const params: Record<string, string> = {
        q: queryParams,
        "page-size": `${numberOfPages}`,
        page: `${page - 1}`,
        fl: "headline,byline,section_name,pub_date,web_url,snippet,multimedia",
        "api-key": API_KEY,
      };
      await delay(1000);
      const data = await requestApi<NewYorkTimesSearchResponse>(
        NEWYORKTIMES_SEARCH_V2,
        "GET",
        params
      );

      const newYorkTimes = extractNewYorkTimesNews(data?.response?.docs || []);

      newYorkTimesNews.push(...newYorkTimes.news);
      newYorkTimesAuthors.push(...newYorkTimes.authors);
    }

    updateNewYorkTimesAuthors(newYorkTimesAuthors);

    newYorkTimesNews = filterNewsArticles(
      newYorkTimesNews,
      getFromCache("selectedCategories", []),
      getFromCache("selectedAuthors", [])
    );
  } catch (error) {
    console.error("Failed to fetch New York Times news:", error);
    newYorkTimesNews = [];
  }

  return newYorkTimesNews;
};
