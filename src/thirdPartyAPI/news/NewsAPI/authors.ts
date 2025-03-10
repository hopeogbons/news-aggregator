import axios, { AxiosResponse } from "axios";
import { NewsApiArticle, NewsApiArticleResponse } from "./types";
import { API_KEY, AUTHORS_API_URL } from "./constants";

export const fetchNewsApiAuthors: () => Promise<string[]> = async (): Promise<
  string[]
> => {
  try {
    const response: AxiosResponse<NewsApiArticleResponse, any> =
      await axios.get<NewsApiArticleResponse>(AUTHORS_API_URL, {
        params: {
          q: "world news",
          apiKey: API_KEY,
        },
      });

    const authors: string[] = response.data.articles
      .map((article: NewsApiArticle) => article.author)
      .filter((author: string | null): author is string => author !== null);

    return authors;
  } catch (error) {
    console.error("Failed to fetch NewsAPI authors:", error);
    return [];
  }
};
