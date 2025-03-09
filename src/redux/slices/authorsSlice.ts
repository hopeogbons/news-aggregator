import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AsyncThunk,
  Slice,
  SliceSelectors,
} from "@reduxjs/toolkit";
import { fetchNewsApiAuthors } from "../../thirdPartyAPI/news/NewsAPI/authors";
import { fetchTheGuardianAuthors } from "../../thirdPartyAPI/news/TheGuardian/authors";
import { fetchNewYorkTimesAuthors } from "../../thirdPartyAPI/news/NewYorkTimes/authors";

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
    fetchNewsApiAuthors(),
    fetchTheGuardianAuthors(),
    fetchNewYorkTimesAuthors(),
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

export default authorsSlice.reducer;
