import { NewsItem } from "../../../redux/slices/newsSlice";
import { extractAuthors } from "../../../utils";
import {
  NewYorkTimesArticle,
  NewYorkTimesArticleSearch,
  NewYorkTimesSection,
} from "./types";

export const extractNewYorkTimesAuthors = (
  articles: NewYorkTimesArticleSearch[]
): string[] => {
  return articles.reduce<string[]>((authors, article) => {
    if (article.byline?.original) {
      const names = article.byline.original
        .replace(/^by\s+/i, "")
        .split(/\s*,\s*|\s+and\s+/);

      names.forEach((name) => {
        const trimmedName = name.trim();
        if (trimmedName) authors.push(trimmedName);
      });
    }
    return authors;
  }, []);
};

export const extractNewYorkTimesCategories = (
  sections: NewYorkTimesSection[]
): Record<string, string> =>
  sections.reduce(
    (categories: Record<string, string>, section: NewYorkTimesSection) => {
      const sectionId: string =
        section?.section?.trim().toLowerCase() ?? "unknown";
      const sectionName: string = section?.display_name ?? "Unknown";
      categories[sectionId] = sectionName;
      return categories;
    },
    {}
  );

const extractImageUrl = (
  multimedia: NewYorkTimesArticleSearch["multimedia"]
): string => {
  if (!multimedia || multimedia.length === 0) {
    return "";
  }

  const image = multimedia.find(
    (media) => media.subtype === "thumbnail" || media.subtype === "wide"
  );

  const selectedImage = image || multimedia[0];
  return selectedImage ? `https://www.nytimes.com/${selectedImage.url}` : "";
};

export const extractNewYorkTimesNews = (
  articles: NewYorkTimesArticleSearch[]
) => {
  const theNewYorkTimes: {
    news: NewsItem[];
    authors: string[];
  } = { news: [], authors: [] };

  articles.forEach((article) => {
    const authors: string[] = extractAuthors(
      article?.byline?.original ?? "Unknown"
    );

    theNewYorkTimes.news.push({
      title: article?.headline?.main ?? "",
      description: article?.abstract ?? "",
      url: article?.web_url ?? "#",
      source: "New York Times",
      publishedAt: article?.pub_date ?? "",
      category: article?.section_name ?? "General",
      author: authors[0],
      thumbnail: extractImageUrl(article.multimedia),
    });

    theNewYorkTimes.authors.push(...authors);
  });

  return theNewYorkTimes;
};
