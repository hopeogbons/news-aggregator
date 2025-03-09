export interface NewYorkTimesSection {
  section_name: string;
}

export interface NewYorkTimesResponse {
  response: {
    docs: NewYorkTimesSection[];
  };
}
