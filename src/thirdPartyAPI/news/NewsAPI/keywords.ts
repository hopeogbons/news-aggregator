import axios, { AxiosResponse } from "axios";
import { NewsApiArticle, NewsApiArticleResponse } from "./types";
import { API_KEY, KEYWORDS_API_URL } from "./constants";
import keywordExtractor from "keyword-extractor";

export const fetchNewsApiKeywords: () => Promise<string[]> = async (): Promise<
  string[]
> => {
  try {
    const response: AxiosResponse<NewsApiArticleResponse, any> =
      await axios.get<NewsApiArticleResponse>(KEYWORDS_API_URL, {
        params: {
          q: "world news",
          apiKey: API_KEY,
        },
      });

    const keywords: string[] = response.data.articles
      .map((article: NewsApiArticle) => article.title)
      .flatMap((title: string) =>
        keywordExtractor.extract(title, {
          language: "english",
          remove_digits: true,
          return_changed_case: false,
          remove_duplicates: true,
        })
      )
      .filter((word) => /^[A-Z].{1,}$/.test(word))
      .sort((a, b) => b.length - a.length)
      .slice(0, 65);

    return keywords;
  } catch (error) {
    console.error("Failed to fetch NewsAPI keywords:", error);
    return [];
  }
};
