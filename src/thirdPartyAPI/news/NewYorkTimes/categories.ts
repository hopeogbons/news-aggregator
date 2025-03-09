import axios, { AxiosResponse } from "axios";
import { NewYorkTimesSectionResponse } from "./types";
import { API_KEY, CATEGORIES_API_URL } from "./constants";

export const fetchNewYorkTimesCategories: () => Promise<
  string[]
> = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<NewYorkTimesSectionResponse, any> =
      await axios.get<NewYorkTimesSectionResponse>(CATEGORIES_API_URL, {
        params: {
          "api-key": API_KEY,
        },
      });

    const categories: string[] = response.data.response.docs.map(
      (article: any) => article.section_name.toLowerCase()
    );

    return categories;
  } catch (error) {
    console.error("Failed to fetch New York Times categories:", error);
    return [];
  }
};
