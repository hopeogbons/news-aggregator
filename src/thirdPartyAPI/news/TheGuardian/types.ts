////////////////
// Categories //
////////////////

export interface TheGuardianSection {
  id: string;
}
export interface TheGuardianSectionResponse {
  response: {
    results: TheGuardianSection[];
  };
}

/////////////
// Authors //
/////////////

export interface TheGuardianArticle {
  tags: {
    webTitle: string | null;
  }[];
  webTitle: string;
  fields: {
    trailText: string;
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
