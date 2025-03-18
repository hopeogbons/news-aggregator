import { NewsItem } from "../../../redux/slices/newsSlice";
import { extractAuthors } from "../../../utils";
import {
  TheGuardianSection,
  TheGuardianArticle,
  TheGuardianTag,
} from "./types";

export const extractTheGuardianAuthors = (tags: TheGuardianTag[]): string[] => {
  const authors: string[] = [];

  tags.forEach((tag: TheGuardianTag) => {
    if (tag.type === "contributor" && tag.webTitle) {
      tag.webTitle.split(/\s*,\s*|\s+and\s+/i).forEach((name: string) => {
        const trimmedName = name.trim();
        if (trimmedName && !authors.includes(trimmedName)) {
          authors.push(trimmedName);
        }
      });
    }
  });

  return authors;
};

export const extractTheGuardianCategories = (
  sections: TheGuardianSection[]
): Record<string, string> =>
  sections.reduce(
    (categories: Record<string, string>, section: TheGuardianSection) => {
      const sectionId: string = section?.id?.trim().toLowerCase() ?? "unknown";
      const sectionCategory: string = section?.webTitle ?? "Unknown";
      categories[sectionId] = sectionCategory;
      return categories;
    },
    {}
  );

export const extractTheGuardianNews = (articles: TheGuardianArticle[]) => {
  const theGuardian: {
    news: NewsItem[];
    authors: string[];
  } = { news: [], authors: [] };

  articles.forEach((item) => {
    const authors: string[] = [];
    item?.tags?.map((tag: any) => {
      authors.push(...extractAuthors(tag.webTitle));
    });
    authors.push(...extractAuthors(item?.fields?.byline));

    theGuardian.news.push({
      title: item?.webTitle ?? "",
      description: item?.fields?.trailText ?? "",
      url: item?.webUrl ?? "#",
      source: "The Guardian",
      publishedAt: item?.webPublicationDate ?? "",
      category: item?.sectionName ?? "General",
      author: authors.length > 0 ? authors[0] : "Unknown",
      thumbnail: item?.fields?.thumbnail ?? "",
    });

    theGuardian.authors.push(...authors);
  });

  return theGuardian;
};
