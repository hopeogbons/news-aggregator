export interface NewsApiSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}
export interface NewsApiSourcesResponse {
  status: string;
  sources: NewsApiSource[];
}

export interface NewsApiArticle {
  author: string | null;
  title: string;
  [key: string]: any;
}

export interface NewsApiEverythingResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}
