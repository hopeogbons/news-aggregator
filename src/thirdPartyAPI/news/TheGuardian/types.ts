export interface TheGuardianTag {
  id: string;
  type: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  references: {
    id: string;
    type: string;
  }[];
  bio: string | null;
  bylineImageUrl: string | null;
  bylineLargeImageUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
  twitterHandle: string | null;
}

export interface TheGuardianTagsResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    results: TheGuardianTag[];
  };
}

export interface TheGuardianArticleTag {
  id: string;
  type: string;
  webTitle: string;
  firstName: string;
  lastName: string;
}

export interface TheGuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields: {
    headline: string;
    trailText: string;
    byline: string;
    thumbnail: string;
    body: string;
  };
  tags: TheGuardianArticleTag[];
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
}

export interface TheGuardianSearchResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy: string;
    results: TheGuardianArticle[];
  };
}

export interface Edition {
  id: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  code: string;
}

export interface TheGuardianSection {
  id: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  editions: Edition[];
}

export interface TheGuardianSectionsResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    results: TheGuardianSection[];
  };
}
