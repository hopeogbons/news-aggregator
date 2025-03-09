import axios, { AxiosResponse } from "axios";
import { NewsApiSource, NewsApiSourceResponse } from "./types";
import { API_KEY, CATEGORIES_API_URL } from "./constants";

export const fetchNewsApiCategories: () => Promise<
  string[]
> = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<NewsApiSourceResponse, any> =
      await axios.get<NewsApiSourceResponse>(CATEGORIES_API_URL, {
        params: {
          apiKey: API_KEY,
        },
      });

    const categories: string[] = response.data.sources.map(
      (source: NewsApiSource) => source.category
    );

    return categories;
  } catch (error) {
    console.error("Failed to fetch NewsAPI categories:", error);
    return [];
  }
};
