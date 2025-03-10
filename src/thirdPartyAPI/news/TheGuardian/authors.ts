import axios, { AxiosResponse } from "axios";
import { TheGuardianArticle, TheGuardianArticleResponse } from "./types";
import { API_KEY, AUTHORS_API_URL } from "./constants";

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
