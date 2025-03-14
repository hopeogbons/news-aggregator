import { NewsItem } from "../../../redux/slices/newsSlice";
import MinHeap from "../../../utils/MinHeap";
import { NewsApiArticle, NewsApiSource } from "./types";
import keywordExtractor from "keyword-extractor";

export const extractNewsApiAuthors = (articles: NewsApiArticle[]): string[] =>
  articles.reduce<string[]>((authors: string[], article: NewsApiArticle) => {
    if (article.author) {
      authors.push(article.author);
    }
    return authors;
  }, []);

export const extractNewsApiCategories = (sources: NewsApiSource[]): string[] =>
  sources.reduce<string[]>((categories: string[], source: NewsApiSource) => {
    if (source.category) {
      categories.push(source.category);
    }
    return categories;
  }, []);

export const extractNewsApiKeywords = (
  articles: NewsApiArticle[]
): string[] => {
  const limitTo = 35;
  const keywordSet = new Set<string>();
  const minHeap = new MinHeap<string>((a, b) => a.length - b.length);

  articles.forEach((article) => {
    if (article.title) {
      const keywords = keywordExtractor.extract(article.title, {
        language: "english",
        remove_digits: true,
        return_changed_case: false,
        remove_duplicates: true,
      });

      keywords.forEach((word) => {
        if (/^[A-Z].{1,}$/.test(word) && !keywordSet.has(word)) {
          keywordSet.add(word);

          if (minHeap.size() < limitTo) {
            minHeap.insert(word);
          } else if (word.length > (minHeap.peek()?.length || 0)) {
            minHeap.extract();
            minHeap.insert(word);
          }
        }
      });
    }
  });

  return minHeap.toArray();
};

export const extractNewsApiNews = (articles: NewsApiArticle[]): NewsItem[] => {
  return articles.map((item) => ({
    title: item.title,
    description: item.description || "",
    url: item.url,
    source: "NewsAPI",
    publishedAt: item.publishedAt,
    category: "General",
    author: item.author || "Unknown",
    thumbnail: item.urlToImage || "",
  }));
};
