import axios, { AxiosResponse } from "axios";
import { TheGuardianArticle, TheGuardianArticleResponse } from "./types";
import { TheGuardianSectionResponse } from "./types";
import {
  API_KEY,
  AUTHORS_API_URL,
  CATEGORIES_API_URL,
  KEYWORDS_API_URL,
  PREFERRED_CATEGORIES,
} from "./constants";

export const fetchTheGuardianAuthors: () => Promise<
  string[]
> = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<TheGuardianArticleResponse, any> =
      await axios.get<TheGuardianArticleResponse>(AUTHORS_API_URL, {
        params: {
          "api-key": API_KEY,
          "show-tags": "contributor",
        },
      });

    const authors: string[] = response.data.response.results
      .flatMap((article: TheGuardianArticle) =>
        article.tags.map(
          (tag: { webTitle: string | null }): string | null => tag.webTitle
        )
      )
      .filter((author: string | null): author is string => author !== null);

    return authors;
  } catch (error) {
    console.error("Failed to fetch The Guardian authors:", error);
    return [];
  }
};

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

export const fetchTheGuardianKeywords: () => Promise<
  string[]
> = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<TheGuardianArticleResponse, any> =
      await axios.get<TheGuardianArticleResponse>(KEYWORDS_API_URL, {
        params: {
          q: "world news",
          "api-key": API_KEY,
          "show-tags": "keyword",
        },
      });

    const keywords: string[] = response.data.response.results
      .flatMap((article: TheGuardianArticle) =>
        article.tags.map(
          (tag: { webTitle: string | null }): string | null => tag.webTitle
        )
      )
      .filter((keyword): keyword is string => keyword !== null);

    return keywords;
  } catch (error) {
    console.error("Failed to fetch The Guardian keywords:", error);
    return [];
  }
};
