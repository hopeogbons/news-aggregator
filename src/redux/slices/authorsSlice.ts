import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AsyncThunk,
  Slice,
  SliceSelectors,
} from "@reduxjs/toolkit";
import { fetchNewsApiArticles } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianArticles } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesArticles } from "../../thirdPartyAPI/news/NewYorkTimes/api";
import { extractNewsApiAuthors } from "../../thirdPartyAPI/news/NewsAPI/services";
import { extractTheGuardianAuthors } from "../../thirdPartyAPI/news/TheGuardian/services";
import { withDefaultQueryString } from "../../utils";
import { extractNewYorkTimesAuthors } from "../../thirdPartyAPI/news/NewYorkTimes/services"

interface AuthorsState {
  authors: string[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthorsState = {
  authors: [],
  loading: false,
  error: null,
};

export const fetchAuthors: AsyncThunk<string[], void, any> = createAsyncThunk<
  string[],
  void
>("authors/fetch", async () => {
  const [newsApiAuthors, theGuardianAuthors, newYorkTimesAuthors]: [
    string[],
    string[],
    string[]
  ] = await Promise.all([
    fetchNewsApiArticles(withDefaultQueryString()).then(extractNewsApiAuthors),
    fetchTheGuardianArticles().then(extractTheGuardianAuthors),
    fetchNewYorkTimesArticles().then(extractNewYorkTimesAuthors),
  ]);

  const allAuthors: string[] = [
    ...newsApiAuthors,
    ...theGuardianAuthors,
    ...newYorkTimesAuthors,
  ];

  const uniqueAuthors: string[] = Array.from(new Set(allAuthors));
  const sortedAuthors: string[] = uniqueAuthors.sort((a: string, b: string) =>
    a.localeCompare(b)
  );

  return sortedAuthors;
});

const authorsSlice: Slice<
  AuthorsState,
  {},
  "authors",
  "authors",
  SliceSelectors<AuthorsState>
> = createSlice({
  name: "authors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAuthors.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.authors = action.payload;
        }
      )
      .addCase(fetchAuthors.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch authors";
      });
  },
});

export type { AuthorsState };
export default authorsSlice.reducer;
