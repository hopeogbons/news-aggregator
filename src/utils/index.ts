import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const shuffleRecords = <T>(records: T[]): T[] => {
  // Fisher Yates' shuffle algorithm
  for (let i = records.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [records[i], records[j]] = [records[j], records[i]];
  }
  return records;
};

export const mergeRecords = async <T>(
  selectedKeys: string[],
  promiseMap: Map<string, Promise<T[]>>,
  isEqual?: (a: T, b: T) => boolean,
  validate?: (record: T) => boolean
): Promise<T[]> => {
  const results = await Promise.allSettled(
    selectedKeys.map((key) => promiseMap.get(key))
  );

  let merged: T[] = [];
  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      const validRecords = validate
        ? result.value.filter(validate)
        : result.value;
      merged = merged.concat(validRecords);
    }
  });

  if (isEqual) {
    const uniqueRecords: T[] = [];
    for (const record of merged) {
      if (!uniqueRecords.some((existing) => isEqual(existing, record))) {
        uniqueRecords.push(record);
      }
    }
    return uniqueRecords;
  } else {
    return Array.from(new Set(merged));
  }
};

export const sortRecords = <T>(
  records: T[],
  sortFunction?: (a: T, b: T) => number
): T[] => {
  return sortFunction
    ? records.sort(sortFunction)
    : records.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
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

export const STOP_WORDS: Set<string> = new Set([
  "the",
  "is",
  "and",
  "a",
  "an",
  "to",
  "in",
  "of",
  "for",
  "on",
  "at",
  "by",
  "it",
  "with",
  "as",
  "from",
  "up",
  "this",
  "that",
  "or",
  "be",
  "are",
  "have",
  "has",
  "was",
  "were",
  "will",
  "would",
  "shall",
  "etc",
  "i",
  "me",
  "my",
  "we",
  "our",
  "you",
  "your",
  "he",
  "she",
  "his",
  "her",
  "they",
  "them",
  "their",
]);

/*export const extractTopKeywordsFromTexts = (texts: string[]): string[] => {
  const frequencyMap = new Map<string, number>();

  texts.forEach((txt) => {
    const tokens = txt
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((token) => token && token.length > 2 && !STOP_WORDS.has(token));
    tokens.forEach((token) => {
      frequencyMap.set(token, (frequencyMap.get(token) || 0) + 1);
    });
  });

  const sorted = Array.from(frequencyMap.entries()).sort((a, b) => b[1] - a[1]);

  return sorted.slice(0, 30).map(([word]) => word);
};*/

export const extractTopKeywordsFromTexts = (
  texts: string[],
  stopWords: Set<string>
): string[] => {
  const frequencyMap = new Map<string, number>();

  const regex = /[^a-z]+/g;
  const isStopWord = (token: string) => stopWords.has(token);

  const allTokens = texts
    .flatMap((txt) => txt.toLowerCase().split(regex))
    .filter((token) => token.length > 2 && !isStopWord(token));

  for (const token of allTokens)
    frequencyMap.set(token, (frequencyMap.get(token) || 0) + 1);

  const sorted = Array.from(frequencyMap).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 30).map(([word]) => word);
};

export const queryBuilder = (
  keyword: string,
  selectedCategories: string[],
  selectedAuthors: string[]
): string => {
  const authorQuery = selectedAuthors.length
    ? ` AND (${selectedAuthors.join(" OR ")})`
    : "";
  const categoryQuery = selectedCategories.length
    ? ` AND (${selectedCategories.join(" OR ")})`
    : "";
  return `${keyword}${authorQuery}${categoryQuery}`.trim();
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
