import {
  TheGuardianSearchResponse,
  TheGuardianSectionsResponse,
} from "./types";
import {
  deduplicateRecords,
  requestApi,
  validateRecords,
} from "../../../utils";
import {
  API_KEY,
  THEGUARDIAN_SEARCH_V2,
  THEGUARDIAN_SECTIONS_V2,
} from "./constants";
import {
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

export const updateTheGuardianAuthors = (authors: string[]): void => {
  let theGuardianAuthors: string[] = JSON.parse(
    localStorage.getItem("theGuardianAuthors") || "[]"
  ) as string[];

  theGuardianAuthors = validateRecords(
    deduplicateRecords([...theGuardianAuthors, ...authors]),
    (a: string) => !!a
  );

  localStorage.setItem(
    "theGuardianAuthors",
    JSON.stringify(theGuardianAuthors)
  );
};

export const fetchTheGuardianAuthors = async (): Promise<string[]> => {
  let theGuardianAuthors: string[] = JSON.parse(
    localStorage.getItem("theGuardianAuthors") || "[]"
  ) as string[];

  return theGuardianAuthors;
};

export const fetchTheGuardianNews = async (
  queryParams: string = "a",
  newsRetrieved: NewsRetrieved
): Promise<NewsItem[]> => {
  let theGuardianNews: NewsItem[] = JSON.parse(
    localStorage.getItem("theGuardianNews") || "[]"
  ) as NewsItem[];

  let theGuardianAuthors: string[] = [];

  if (theGuardianNews.length === 0) {
    try {
      const { newsPerPage, numberOfPages } = newsRetrieved;

      for (let page = 1; page <= newsPerPage; page++) {
        const params: Record<string, string> = {
          q: queryParams,
          "show-tags": "contributor",
          "show-fields": "headline,trailText,byline,thumbnail",
          page: `${page}`,
          "page-size": `${numberOfPages}`,
          "api-key": API_KEY,
        };
        const data = await requestApi<TheGuardianSearchResponse>(
          THEGUARDIAN_SEARCH_V2,
          "GET",
          params
        );

        const theGuardian = extractTheGuardianNews(
          data?.response?.results ?? []
        );

        theGuardianNews.push(...theGuardian["news"]);
        theGuardianAuthors.push(...theGuardian["authors"]);
      }

      updateTheGuardianAuthors(theGuardianAuthors);

      localStorage.setItem("theGuardianNews", JSON.stringify(theGuardianNews));
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  }

  return theGuardianNews;
};
