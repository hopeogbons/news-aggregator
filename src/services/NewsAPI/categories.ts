import axios, { AxiosResponse } from "axios";
import { NewsApiResponse } from "../NewsAPI/types";

const apiKey = import.meta.env.VITE_NEWSAPI_KEY;

export const fetchNewsAPICategories = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<NewsApiResponse, any> =
      await axios.get<NewsApiResponse>(
        "https://newsapi.org/v2/top-headlines/sources",
        {
          params: {
            apiKey,
          },
        }
      );

    const categories: string[] = response.data.sources.map(
      (source) => source.category
    );

    return categories;
  } catch (error) {
    console.error("Failed to fetch NewsAPI categories:", error);
    return [];
  }
};
