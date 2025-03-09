import axios, { AxiosResponse } from "axios";
import { TheGuardianResponse } from "../TheGuardian/types";

const PREFERRED_CATEGORIES: string[] = [
  "news",
  "politics",
  "sport",
  "business",
  "technology",
  "environment",
  "science",
  "culture",
  "artanddesign",
  "film",
  "music",
  "books",
  "tv-and-radio",
  "global-development",
  "world",
  "uk-news",
  "us-news",
  "australia-news",
  "education",
  "society",
  "law",
  "media",
  "fashion",
  "lifeandstyle",
  "travel",
  "money",
  "healthcare-network",
  "inequality",
  "cities",
  "weather",
];

const apiKey = import.meta.env.VITE_THEGUARDIAN_KEY;

export const fetchTheGuardianCategories = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<TheGuardianResponse, any> =
      await axios.get<TheGuardianResponse>(
        "https://content.guardianapis.com/sections",
        {
          params: {
            "api-key": apiKey,
          },
        }
      );

    const sections: string[] = response.data.response.results.map(
      (section) => section.id
    );

    const categories = PREFERRED_CATEGORIES
      ? sections.filter((section) => PREFERRED_CATEGORIES.includes(section))
      : sections;

    return categories;
  } catch (error) {
    console.error("Failed to fetch New York Times categories:", error);
    return [];
  }
};
