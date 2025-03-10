////////////////
// Categories //
////////////////

export interface NewYorkTimesSection {
  section_name: string;
}
export interface NewYorkTimesSectionResponse {
  response: {
    docs: NewYorkTimesSection[];
  };
}

/////////////
// Authors //
/////////////

export interface NewYorkTimesArticle {
  byline: {
    original: string | null;
  };
  headline: {
    main: string;
  };
  keywords: [{ name: string; value: string }];
  abstract: string;
  web_url: string;
  pub_date: string;
}
export interface NewYorkTimesArticleResponse {
  status: string;
  response: {
    docs: NewYorkTimesArticle[];
  };
}
