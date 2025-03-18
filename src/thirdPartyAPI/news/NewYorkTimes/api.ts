import {
  NewYorkTimesSearchResponse,
  NewYorkTimesSectionsResponse,
} from "./types";
import {
  deduplicateRecords,
  requestApi,
  validateRecords,
} from "../../../utils";
import {
  API_KEY,
  NEWYORKTIMES_SEARCH_V2,
  NEWYORKTIMES_SECTION_V3,
} from "./constants";
import {
  extractNewYorkTimesCategories,
  extractNewYorkTimesNews,
} from "./services";
import { NewsItem, NewsRetrieved } from "../../../redux/slices/newsSlice";

export const fetchNewYorkTimesCategories: () => Promise<{
  newYorkTimesCategories: string[];
  newYorkTimesCategoriesMap: Record<string, string>;
}> = async () => {
  let newYorkTimesCategories: string[] = JSON.parse(
    localStorage.getItem("newYorkTimesCategories") || "[]"
  ) as string[];
  let newYorkTimesCategoriesMap: Record<string, string> = JSON.parse(
    localStorage.getItem("newYorkTimesCategoriesMap") || "[]"
  ) as Record<string, string>;

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

      newYorkTimesCategoriesMap = extractNewYorkTimesCategories(
        data?.results ?? []
      );
      newYorkTimesCategories = Object.values(newYorkTimesCategoriesMap);

      localStorage.setItem(
        "newYorkTimesCategoriesMap",
        JSON.stringify(newYorkTimesCategoriesMap)
      );
      localStorage.setItem(
        "newYorkTimesCategories",
        JSON.stringify(newYorkTimesCategories)
      );
    } catch (error) {
      console.error("Error fetching New York Times Categories: ", error);
      newYorkTimesCategories = [];
      newYorkTimesCategoriesMap = {};
    }
  }

  return { newYorkTimesCategories, newYorkTimesCategoriesMap };
};

export const updateNewYorkTimesAuthors = (authors: string[]): void => {
  let newYorkTimesAuthors: string[] = JSON.parse(
    localStorage.getItem("newYorkTimesAuthors") || "[]"
  ) as string[];

  newYorkTimesAuthors = validateRecords(
    deduplicateRecords([...newYorkTimesAuthors, ...authors]),
    (a: string) => !!a
  );

  localStorage.setItem(
    "newYorkTimesAuthors",
    JSON.stringify(newYorkTimesAuthors)
  );
};

export const fetchNewYorkTimesAuthors = async (): Promise<string[]> => {
  let newYorkTimesAuthors: string[] = JSON.parse(
    localStorage.getItem("newYorkTimesAuthors") || "[]"
  ) as string[];

  return newYorkTimesAuthors;
};

export const fetchNewYorkTimesNews = async (
  queryParams: string = "world+news",
  newsRetrieved: NewsRetrieved
): Promise<NewsItem[]> => {
  let newYorkTimesNews: NewsItem[] = JSON.parse(
    localStorage.getItem("newYorkTimesNews") || "[]"
  ) as NewsItem[];

  let newYorkTimesAuthors: string[] = [];

  if (newYorkTimesNews.length === 0) {
    try {
      const { newsPerPage, numberOfPages } = newsRetrieved;

      for (let page = 1; page <= newsPerPage; page++) {
        const params: Record<string, string> = {
          q: queryParams,
          "page-size": `${numberOfPages}`,
          page: `${page - 1}`,
          fl: "headline,byline,section_name,pub_date,web_url,snippet,multimedia",
          "api-key": API_KEY,
        };
        const data = await requestApi<NewYorkTimesSearchResponse>(
          NEWYORKTIMES_SEARCH_V2,
          "GET",
          params
        );

        const newYorkTimes = extractNewYorkTimesNews(
          data?.response?.docs ?? []
        );

        newYorkTimesNews.push(...newYorkTimes["news"]);
        newYorkTimesAuthors.push(...newYorkTimes["authors"]);
      }

      updateNewYorkTimesAuthors(newYorkTimesAuthors);

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
