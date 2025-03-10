import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AsyncThunk,
  Slice,
  SliceSelectors,
} from "@reduxjs/toolkit";
import { fetchNewsApiKeywords } from "../../thirdPartyAPI/news/NewsAPI/keywords";
import { fetchTheGuardianKeywords } from "../../thirdPartyAPI/news/TheGuardian/keywords";
import { fetchNewYorkTimesKeywords } from "../../thirdPartyAPI/news/NewYorkTimes/keywords";
import { randomizeItems } from "../../utils";

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
    fetchNewsApiKeywords(),
    fetchTheGuardianKeywords(),
    fetchNewYorkTimesKeywords(),
  ]);

  const allKeywords: string[] = [
    ...newsApiKeywords,
    ...theGuardianKeywords,
    ...newYorkTimesKeywords,
  ];

  const limitTo = 20;
  const uniqueKeywords: string[] = Array.from(new Set(allKeywords));
  const sortedKeywords: string[] = randomizeItems(uniqueKeywords, limitTo);

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
