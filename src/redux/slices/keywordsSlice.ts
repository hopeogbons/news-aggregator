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
import { fetchRandomSubset, withDefaultQueryString } from "../../utils";
import { extractTheGuardianKeywords } from "../../thirdPartyAPI/news/TheGuardian/services";
import { extractNewsApiKeywords } from "../../thirdPartyAPI/news/NewsAPI/services";
import { extractNewYorkTimesKeywords } from "../../thirdPartyAPI/news/NewYorkTimes/services";

interface KeywordsState {
  keywords: string[];
  loading: boolean;
  error: string | null;
}

const initialState: KeywordsState = {
  keywords: [],
  loading: false,
  error: null,
};

export const fetchKeywords: AsyncThunk<string[], void, any> = createAsyncThunk<
  string[],
  void
>("keywords/fetch", async () => {
  const [newsApiKeywords, theGuardianKeywords, newYorkTimesKeywords]: [
    string[],
    string[],
    string[]
  ] = await Promise.all([
    fetchNewsApiArticles(withDefaultQueryString()).then(extractNewsApiKeywords),
    fetchTheGuardianArticles(withDefaultQueryString()).then(
      extractTheGuardianKeywords
    ),
    fetchNewYorkTimesArticles(withDefaultQueryString()).then(
      extractNewYorkTimesKeywords
    ),
  ]);

  const allKeywords: string[] = [
    ...newsApiKeywords,
    ...theGuardianKeywords,
    ...newYorkTimesKeywords,
  ];

  const limitTo = 30;
  const uniqueKeywords: string[] = Array.from(new Set(allKeywords));
  const sortedKeywords: string[] = fetchRandomSubset(uniqueKeywords, limitTo);

  return sortedKeywords;
});

const keywordsSlice: Slice<
  KeywordsState,
  {},
  "keywords",
  "keywords",
  SliceSelectors<KeywordsState>
> = createSlice({
  name: "keywords",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKeywords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchKeywords.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.keywords = action.payload;
        }
      )
      .addCase(fetchKeywords.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch keywords";
      });
  },
});

export type { KeywordsState };
export default keywordsSlice.reducer;
