import axios, { AxiosResponse } from "axios";
import { TheGuardianSectionResponse } from "./types";
import { API_KEY, CATEGORIES_API_URL, PREFERRED_CATEGORIES } from "./constants";

export const fetchTheGuardianCategories: () => Promise<
  string[]
> = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<TheGuardianSectionResponse, any> =
      await axios.get<TheGuardianSectionResponse>(CATEGORIES_API_URL, {
        params: {
          "api-key": API_KEY,
        },
      });

    const sections: string[] = response.data.response.results.map(
      (section) => section.id
    );

    const categories = PREFERRED_CATEGORIES
      ? sections.filter((section): section is string =>
          PREFERRED_CATEGORIES.includes(section)
        )
      : sections;

    return categories;
  } catch (error) {
    console.error("Failed to fetch The Guardian categories:", error);
    return [];
  }
};
