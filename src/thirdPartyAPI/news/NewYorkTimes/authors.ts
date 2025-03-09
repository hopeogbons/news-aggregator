import axios, { AxiosResponse } from "axios";
import { NewYorkTimesArticle, NewYorkTimesArticleResponse } from "./types";
import { API_KEY, AUTHORS_API_URL } from "./constants";

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
