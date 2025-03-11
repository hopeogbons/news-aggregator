import {
  TheGuardianArticle,
  TheGuardianArticleResponse,
  TheGuardianSection,
} from "./types";
import { TheGuardianSectionResponse } from "./types";
import { API_KEY, SEARCH_URL, SECTIONS_URL } from "./constants";
import { requestApi } from "../../../utils";

export const fetchTheGuardianCategories = async (): Promise<
  TheGuardianSection[]
> => {
  const data = await requestApi<TheGuardianSectionResponse>(
    SECTIONS_URL,
    "GET",
    { "api-key": API_KEY },
    "Failed to fetch The Guardian categories"
  );

  return data?.response?.results ?? [];
};

export const fetchTheGuardianArticles = async (
  query?: string
): Promise<TheGuardianArticle[]> => {
  const params: Record<string, string> = {
    "show-fields": "byline",
    "show-tags": "contributor,keyword",
    "api-key": API_KEY,
  };
  if (query) params.q = query;

  const data: TheGuardianArticleResponse | null =
    await requestApi<TheGuardianArticleResponse>(
      SEARCH_URL,
      "GET",
      params,
      "Failed to fetch The Guardian articles"
    );

  return data?.response?.results ?? [];
};

/*
  ### fetchGuardianArticles
  
    // Filter results to ensure they match at least one category and one author
    const filteredArticles = response.data.response.results.filter(
      (article: any) => {
        const matchesCategory = categories.some(
          (cat) =>
            article.webTitle.includes(cat) ||
            article.fields?.trailText?.includes(cat)
        );
        const matchesAuthor = authors.some((author) =>
          article.fields?.byline?.includes(author)
        );
        return matchesCategory && matchesAuthor;
      }
    );

    return filteredArticles;
*/
