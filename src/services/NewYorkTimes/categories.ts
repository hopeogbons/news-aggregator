import axios, { AxiosResponse } from "axios";
import { NewYorkTimesResponse } from "../NewYorkTimes/types";

const apiKey = import.meta.env.VITE_NEWYORKTIMES_KEY;

export const fetchNewYorkTimesCategories = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<NewYorkTimesResponse, any> =
      await axios.get<NewYorkTimesResponse>(
        "https://api.nytimes.com/svc/search/v2/articlesearch.json",
        {
          params: {
            "api-key": apiKey,
          },
        }
      );

    const categories = response.data.response.docs.map((article: any) =>
      article.section_name.toLowerCase()
    );

    return categories;
  } catch (error) {
    console.error("Failed to fetch New York Times categories:", error);
    return [];
  }
};
