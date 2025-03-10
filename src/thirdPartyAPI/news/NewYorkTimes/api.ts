import axios, { AxiosResponse } from "axios";
import {
  NewYorkTimesArticle,
  NewYorkTimesArticleResponse,
  NewYorkTimesSectionResponse,
} from "./types";
import {
  API_KEY,
  AUTHORS_API_URL,
  CATEGORIES_API_URL,
  KEYWORDS_API_URL,
} from "./constants";

export const fetchNewYorkTimesAuthors: () => Promise<
  string[]
> = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<NewYorkTimesArticleResponse, any> =
      await axios.get<NewYorkTimesArticleResponse>(AUTHORS_API_URL, {
        params: {
          "api-key": API_KEY,
        },
      });

    const authors: string[] = response.data.response.docs
      .map((article: NewYorkTimesArticle) => article.byline?.original)
      .filter(
        (original: string | null): original is string => original !== null
      )
      .map((original: string) => original.replace(/^By\s+/i, ""));

    return authors;
  } catch (error) {
    console.error("Failed to fetch New York Times authors:", error);
    return [];
  }
};

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

export const fetchNewYorkTimesKeywords: () => Promise<
  string[]
> = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<NewYorkTimesArticleResponse, any> =
      await axios.get<NewYorkTimesArticleResponse>(KEYWORDS_API_URL, {
        params: {
          q: "world news",
          "api-key": API_KEY,
        },
      });

    const keywords: string[] = response.data.response.docs
      .flatMap(
        (article: NewYorkTimesArticle) =>
          article.keywords?.map(
            (keyword: { name: string; value: string }) => keyword.value
          ) || []
      )
      .filter((keyword): keyword is string => keyword !== undefined);

    return keywords;
  } catch (error) {
    console.error("Failed to fetch New York Times keywords:", error);
    return [];
  }
};
