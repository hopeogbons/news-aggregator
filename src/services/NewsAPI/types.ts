export interface NewsApiSource {
  category: string;
}

export interface NewsApiResponse {
  sources: NewsApiSource[];
}
