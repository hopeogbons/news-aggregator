export interface NewYorkTimesSection {
  section: string;
  display_name: string;
  url: string;
  subsection?: string;
}

export interface NewYorkTimesSectionResponse {
  status: string;
  results: NewYorkTimesSection[];
}

export interface NewYorkTimesSearch {
  byline: {
    original: string | null;
  };
  headline: {
    main: string;
  };
  keywords: { name: string; value: string }[];
  abstract: string;
  web_url: string;
  pub_date: string;
  section_name?: string;
}

export interface NewYorkTimesSearchResponse {
  status: string;
  response: {
    docs: NewYorkTimesSearch[];
  };
}
