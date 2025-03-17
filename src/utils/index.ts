import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import keyword_extractor from "keyword-extractor";

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
  selectedKeys: string[],
  promiseMap: Record<string, T[]>
): Promise<T[]> => {
  const results = await Promise.allSettled(
    selectedKeys.map((key) => promiseMap[key])
  );

  let merged: T[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
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
  texts: string[],
  limitTo: number
): string[] => {
  const uniqueKeywords = new Set<string>();

  for (const text of texts) {
    const keywords = keyword_extractor.extract(text, {
      language: "en",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: true,
      return_chained_words: true,
    });
    for (const keyword of keywords) {
      uniqueKeywords.add(keyword);
    }
  }

  const filteredKeywords: string[] = Array.from(uniqueKeywords).filter(
    (keyword) => /^[A-Z]/.test(keyword)
  );

  const sortedKeywords = shuffleRecords(Array.from(filteredKeywords));

  return sortedKeywords.slice(0, limitTo);
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
