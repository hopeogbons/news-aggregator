export interface TheGuardianSection {
  id: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  editions?: any[];
}

export interface TheGuardianSectionsResponse {
  response: {
    status: string;
    results: TheGuardianSection[];
  };
}

export interface TheGuardianAuthorTag {
  id: string;
  type: string;
  webTitle: string;
  [key: string]: any;
}

export interface TheGuardianTagsResponse {
  response: {
    status: string;
    results: TheGuardianAuthorTag[];
  };
}
