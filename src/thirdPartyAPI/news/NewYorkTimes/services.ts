import { NewsItem } from "../../../redux/slices/newsSlice";
import { removeByPrefix } from "../../../utils";
import { NewYorkTimesArticleSearch, NewYorkTimesSection } from "./types";

export const extractNewYorkTimesAuthors = (
  articles: NewYorkTimesArticleSearch[]
): string[] => {
  if (!articles) return [];

  return articles
    .map((article) => article.byline?.original)
    .filter((byline): byline is string => !!byline)
    .map((byline) => byline.replace(/^by\s+/i, ""));
};

export const extractNewYorkTimesCategories = (
  sections: NewYorkTimesSection[]
): Record<string, string> => {
  if (!sections) return {};

  return sections.reduce(
    (categories: Record<string, string>, section: NewYorkTimesSection) => {
      const sectionId = section?.section?.trim().toLowerCase() || "unknown";
      const sectionName = section?.display_name || "General";
      categories[sectionId] = sectionName;
      return categories;
    },
    {}
  );
};

const extractImageUrl = (
  multimedia: NewYorkTimesArticleSearch["multimedia"]
): string => {
  if (!multimedia || multimedia.length === 0) return "";

  const image = multimedia.find(
    (media) => media.subtype === "thumbnail" || media.subtype === "wide"
  );

  const selectedImage = image || multimedia[0];
  return selectedImage ? `https://www.nytimes.com/${selectedImage.url}` : "";
};

export const extractNewYorkTimesNews = (
  articles: NewYorkTimesArticleSearch[]
): { news: NewsItem[]; authors: string[] } => {
  if (!articles) return { news: [], authors: [] };

  const theNewYorkTimes: { news: NewsItem[]; authors: string[] } = {
    news: [],
    authors: [],
  };

  articles.forEach((article) => {
    const author = removeByPrefix(article?.byline?.original || "Unknown");
    const category = article?.section_name || "General";

    theNewYorkTimes.news.push({
      title: article?.headline?.main || "",
      description: article?.abstract || "",
      url: article?.web_url || "#",
      source: "New York Times",
      publishedAt: article?.pub_date || "",
      category,
      author: author,
      thumbnail: extractImageUrl(article.multimedia),
    });

    theNewYorkTimes.authors.push(author);
  });

  return theNewYorkTimes;
};
