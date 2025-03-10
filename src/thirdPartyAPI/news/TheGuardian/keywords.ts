import axios, { AxiosResponse } from "axios";
import { TheGuardianArticle, TheGuardianArticleResponse } from "./types";
import { API_KEY, KEYWORDS_API_URL } from "./constants";

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
