import axios, { AxiosResponse } from "axios";
import { NewYorkTimesArticle, NewYorkTimesArticleResponse } from "./types";
import { API_KEY, KEYWORDS_API_URL } from "./constants";

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
