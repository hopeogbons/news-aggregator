import { NewsItem } from "../../../redux/slices/newsSlice";
import { removeByPrefix } from "../../../utils";
import {
  TheGuardianSection,
  TheGuardianArticle,
  TheGuardianTag,
} from "./types";

export const extractTheGuardianAuthors = (tags: TheGuardianTag[]): string[] => {
  const authors: string[] = [];

  tags.forEach((tag: TheGuardianTag) => {
    if (tag.type === "contributor" && tag.webTitle) authors.push(tag.webTitle);
  });

  return authors;
};

export const extractTheGuardianCategories = (
  sections: TheGuardianSection[]
): Record<string, string> => {
  if (!sections) return {};

  return sections.reduce(
    (categories: Record<string, string>, section: TheGuardianSection) => {
      const sectionId = section?.id?.trim().toLowerCase() || "unknown";
      const sectionCategory = section?.webTitle || "General";
      categories[sectionId] = sectionCategory;
      return categories;
    },
    {}
  );
};

export const extractTheGuardianNews = (
  articles: TheGuardianArticle[]
): { news: NewsItem[]; authors: string[] } => {
  if (!articles) return { news: [], authors: [] };

  const theGuardian: { news: NewsItem[]; authors: string[] } = {
    news: [],
    authors: [],
  };

  articles.forEach((item: TheGuardianArticle) => {
    const author: string = removeByPrefix(item?.fields?.byline || "Unknown");

    theGuardian.news.push({
      title: item?.webTitle || "",
      description: item?.fields?.trailText || "",
      url: item?.webUrl || "#",
      source: "The Guardian",
      publishedAt: item?.webPublicationDate || "",
      category: item?.sectionName || "General",
      author: author,
      thumbnail: item?.fields?.thumbnail || "",
    });

    theGuardian.authors.push(author);
  });

  return theGuardian;
};
