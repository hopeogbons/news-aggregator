export interface TheGuardianSection {
  id: string;
}

export interface TheGuardianResponse {
  response: {
    results: TheGuardianSection[];
  };
}
