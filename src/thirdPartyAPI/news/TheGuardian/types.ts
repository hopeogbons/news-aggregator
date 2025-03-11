export interface TheGuardianSection {
  id: string;
}
export interface TheGuardianSectionResponse {
  response: {
    results: TheGuardianSection[];
  };
}

export interface TheGuardianArticle {
  tags: {
    webTitle: string | null;
    type: string;
  }[];
  webTitle: string;
  fields?: {
    byline?: string;
  };
  webUrl: string;
  webPublicationDate: string;
}
export interface TheGuardianArticleResponse {
  response: {
    status: string;
    total: number;
    results: TheGuardianArticle[];
  };
}
