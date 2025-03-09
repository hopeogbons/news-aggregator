////////////////
// Categories //
////////////////

export interface NewsApiSource {
  category: string;
}
export interface NewsApiSourceResponse {
  sources: NewsApiSource[];
}

/////////////
// Authors //
/////////////

export interface NewsApiArticle {
  author: string | null;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}
export interface NewsApiArticleResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}
