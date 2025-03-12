import { NewYorkTimesSearchResponse } from "./types";
import { requestApi } from "../../../utils";
import { API_KEY, NEWYORKTIMES_SEARCH_V2 } from "./constants";
import {
  extractNewYorkTimesAuthors,
  extractNewYorkTimesCategories,
} from "./services";

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
