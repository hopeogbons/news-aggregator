export interface NewYorkTimesSection {
  section: string;
  display_name: string;
}

export interface NewYorkTimesSectionsResponse {
  status: string;
  copyright: string;
  num_results: number;
  results: NewYorkTimesSection[];
}

export interface NewYorkTimesArticleSearch {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  source: string;
  multimedia: Array<{
    url: string;
    subtype: string;
  }>;
  headline: {
    main: string;
  };
  keywords: Array<{
    name: string;
    value: string;
    rank: number;
    major: string;
  }>;
  pub_date: string;
  section_name: string;
  subsection_name: string | null;
  byline: {
    original: string | null;
  };
  _id: string;
  word_count: number;
  uri: string;
}

export interface NewYorkTimesSearchResponse {
  status: string;
  copyright: string;
  response: {
    docs: NewYorkTimesArticleSearch[];
    meta: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}

export interface NewYorkTimesArticle {
  title: string;
  byline: string;
  published_date: string;
}

export interface NewYorkTimesArticlesResponse {
  status: string;
  copyright: string;
  section: string;
  last_updated: string;
  num_results: number;
  results: NewYorkTimesArticle[];
}
