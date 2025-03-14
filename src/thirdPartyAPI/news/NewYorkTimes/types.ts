export interface NewYorkTimesArticle {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  source: string;
  multimedia: {
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
  }[];
  headline: {
    main: string;
    kicker: string | null;
    content_kicker: string | null;
    print_headline: string | null;
    name: string | null;
    seo: string | null;
    sub: string | null;
  };
  keywords: {
    name: string;
    value: string;
    rank: number;
    major: string;
  }[];
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  subsection_name: string | null;
  byline: {
    original: string | null;
    person: {
      firstname: string | null;
      middlename: string | null;
      lastname: string | null;
      qualifier: string | null;
      title: string | null;
      role: string;
      organization: string;
      rank: number;
    }[];
  };
  type_of_material: string;
  _id: string;
  word_count: number;
  uri: string;
}

export interface NewYorkTimesSearchResponse {
  status: string;
  copyright: string;
  response: {
    docs: NewYorkTimesArticle[];
    meta: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}
