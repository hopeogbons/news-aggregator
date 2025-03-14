import { NewsApiEverythingResponse, NewsApiSourcesResponse } from "./types";
import {
  API_KEY,
  NEWSAPI_EVERYTHING_V2,
  NEWSAPI_SOURCES_V2,
} from "./constants";
import {
  extractNewsApiAuthors,
  extractNewsApiCategories,
  extractNewsApiNews,
} from "./services";
import { NewsItem, NewsRetrieved } from "../../../redux/slices/newsSlice";

export const fetchNewsApiCategories = async (): Promise<string[]> => {
  let newsApiCategories: string[] = JSON.parse(
    localStorage.getItem("newsApiCategories") || "[]"
  ) as string[];

  if (newsApiCategories.length === 0) {
    try {
      const url = `${NEWSAPI_SOURCES_V2}?apiKey=${API_KEY}`;
      const response = await fetch(url);
      const data: NewsApiSourcesResponse = await response.json();
      newsApiCategories = extractNewsApiCategories(data?.sources ?? []);
      localStorage.setItem(
        "newsApiCategories",
        JSON.stringify(newsApiCategories)
      );
    } catch (error) {
      console.error("Error fetching NewsAPI Categories: ", error);
      newsApiCategories = [];
    }
  }

  return newsApiCategories;
};

export const fetchNewsApiAuthors = async (): Promise<string[]> => {
  let newsApiAuthors: string[] = JSON.parse(
    localStorage.getItem("newsApiAuthors") || "[]"
  ) as string[];

  if (newsApiAuthors.length === 0) {
    try {
      const url = `${NEWSAPI_EVERYTHING_V2}?q=example&apiKey=${API_KEY}`;
      const response = await fetch(url);
      const data: NewsApiEverythingResponse = await response.json();
      newsApiAuthors = extractNewsApiAuthors(data?.articles ?? []);
      localStorage.setItem("newsApiAuthors", JSON.stringify(newsApiAuthors));
    } catch (error) {
      console.error("Error fetching NewsAPI Authors: ", error);
      newsApiAuthors = [];
    }
  }

  return newsApiAuthors;
};

export const fetchNewsApiNews = async (
  queryParams: string = "world+news",
  newsRetrieved: NewsRetrieved
): Promise<NewsItem[]> => {
  let newsApiNews: NewsItem[] = JSON.parse(
    localStorage.getItem("newsApiNews") || "[]"
  ) as NewsItem[];

  if (newsApiNews.length === 0) {
    try {
      const { newsPerPage, numberOfPages } = newsRetrieved;

      for (let page = 1; page <= newsPerPage; page++) {
        const url = `${NEWSAPI_EVERYTHING_V2}?q=${encodeURIComponent(
          queryParams
        )}&pageSize=${numberOfPages}&page=${page}&apiKey=${API_KEY}`;
        const response = await fetch(url);
        const data: NewsApiEverythingResponse = await response.json();
        newsApiNews.push(...extractNewsApiNews(data?.articles ?? []));
      }

      localStorage.setItem("newsApiNews", JSON.stringify(newsApiNews));
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  }

  return newsApiNews;
};
