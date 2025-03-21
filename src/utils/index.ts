import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import keyword_extractor from "keyword-extractor";
import { NewsItem } from "../redux/slices/newsSlice";

export const shuffleRecords = <T>(records: T[]): T[] => {
  // Fisher Yates' shuffle algorithm
  for (let i = records.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [records[i], records[j]] = [records[j], records[i]];
  }
  return records;
};

export const validateRecords = <T>(
  records: T[],
  validate: (record: T) => boolean
): T[] => {
  return records.filter(validate);
};

export const deduplicateRecords = <T>(
  records: T[],
  keyFn?: (record: T) => any
): T[] => {
  if (keyFn) {
    const map = new Map<any, T>();
    for (const record of records) {
      const key = keyFn(record);
      if (!map.has(key)) {
        map.set(key, record);
      }
    }
    return [...map.values()];
  }
  return [...new Set(records)];
};

export const sortRecords = <T>(
  records: T[],
  sortFunction?: (a: T, b: T) => number
): T[] => {
  return sortFunction
    ? records.sort(sortFunction)
    : records.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
};

export const mergeRecords = async <T>(
  promiseMap: Record<string, Promise<T[]>>
): Promise<T[]> => {
  const promises = Object.values(promiseMap);
  const results = await Promise.allSettled(promises);

  let merged: T[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      merged = merged.concat(result.value);
    }
  });

  return merged;
};

export const requestApi = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  params: Record<string, any> = {}
): Promise<T | null> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      ...(method === "GET" ? { params } : { data: params }),
    };

    const response: AxiosResponse<T> = await axios.request<T>(config);
    return response.data;
  } catch (error: any) {
    console.error(`${method}: ${url}`, error.response?.data || error.message);
    return null;
  }
};

export const extractTopKeywordsFromTexts = (
  mergedNews: NewsItem[],
  limitTo: number
): string[] => {
  let extracts: string[] = mergedNews
    .map((item) => {
      const { title, description } = item;
      return keyword_extractor.extract(`${title} ${description}`, {
        language: "en",
        remove_digits: true,
        return_changed_case: false,
        remove_duplicates: true,
        return_chained_words: true,
      });
    })
    .flat();

  const keywords = shuffleRecords(
    validateRecords(deduplicateRecords(extracts), (a) => /^[A-Z]/.test(a))
  );
  return keywords.slice(0, limitTo);
};

export const queryBuilder = (
  keyword: string,
  selectedCategories: string[],
  selectedAuthors: string[]
): string => {
  const authorsQuery = selectedAuthors.length
    ? ` AND (${selectedAuthors.join(" OR ")})`
    : "";
  const categoriesQuery = selectedCategories.length
    ? ` AND (${selectedCategories.join(" OR ")})`
    : "";
  return `${keyword}${authorsQuery}${categoriesQuery}`.trim();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day: number = date.getDate();
  const month: string = date.toLocaleString("default", { month: "short" });
  const year: number = date.getFullYear();

  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const ordinalSuffix: string = getOrdinalSuffix(day);
  return `${day}${ordinalSuffix} ${month}, ${year}`;
};

export const removeByPrefix = (strNames: string = ""): string =>
  strNames.replace(/^by\s+/i, "");

export const saveToCache = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromCache = <T>(key: string, defaultValue: T): T => {
  const cachedData = localStorage.getItem(key);

  if (!cachedData) return defaultValue;

  try {
    return JSON.parse(cachedData);
  } catch (error) {
    return cachedData as unknown as T;
  }
};

export const filterNewsArticles = (
  articles: NewsItem[],
  categoryArray: string[],
  authorArray: string[] = [],
  sourceArray: string[] = [],
  date: string = ""
) => {
  const news = articles.filter((article: NewsItem) => {
    const categoryMatch =
      !categoryArray ||
      categoryArray.length === 0 ||
      categoryArray.includes(article.category);

    const authorMatch =
      !authorArray ||
      authorArray.length === 0 ||
      authorArray.some((name) => article?.author.includes(name));

    const sourceMatch =
      !sourceArray ||
      sourceArray.length === 0 ||
      sourceArray.includes(article.source);

    let dateMatch = true;
    if (date) {
      const searchDate = new Date(date).toISOString().split("T")[0];
      const itemDate = new Date(article.publishedAt)
        .toISOString()
        .split("T")[0];
      dateMatch = itemDate === searchDate;
    }

    return authorMatch && categoryMatch && sourceMatch && dateMatch;
  });

  return news;
};

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
