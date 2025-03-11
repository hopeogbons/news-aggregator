import {
  NewYorkTimesArticle,
  NewYorkTimesArticleResponse,
  NewYorkTimesSectionResponse,
} from "./types";
import { API_KEY, ARTICLE_SEARCH_URL_V2 } from "./constants";
import { requestApi } from "../../../utils";

export const fetchNewYorkTimesArticles = async (
  query?: string
): Promise<NewYorkTimesArticle[]> => {
  const params: Record<string, string> = {
    sortBy: "relevancy",
    "api-key": API_KEY,
    apiKey: API_KEY,
  };
  if (query) params.q = query;

  const data: NewYorkTimesArticleResponse | null =
    await requestApi<NewYorkTimesArticleResponse>(
      ARTICLE_SEARCH_URL_V2,
      "GET",
      params,
      "Failed to fetch New York Times articles"
    );

  return data?.response?.docs ?? [];
};

/*
 # Articles extraction, future use

  const filteredArticles: NewYorkTimesArticle[] = data.response.docs.filter(
    (article: NewYorkTimesArticle) => {
      const matchesCategory: boolean = categories.some(
        (category: string) =>
          article.headline.main.includes(category) ||
          article.abstract.includes(category)
      );
      const matchesAuthor: boolean = authors.some((author: string) =>
        article.byline?.original?.includes(author)
      );
      return matchesCategory && matchesAuthor;
    }
  );

  const articles: NewYorkTimesArticle[] = filteredArticles.map(
    (article: NewYorkTimesArticle) => ({
      ...article,
      source: "New York Times",
      publishedAt: article.pub_date,
    })
  );

  return articles;
*/
