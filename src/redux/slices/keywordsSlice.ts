import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { extractTopKeywordsFromTexts } from "../../utils";

export interface KeywordsState {
  keywords: string[];
  loading: boolean;
  error: string | null;
}

const initialState: KeywordsState = {
  keywords: [],
  loading: false,
  error: null,
};

export const fetchKeywords = createAsyncThunk<
  string[],
  void,
  { state: RootState }
>("keywords/fetchKeywords", async (_, { getState, rejectWithValue }) => {
  try {
    const { news } = getState();
    const { mergedNews } = news;
    const limitTo: number = 10;

    if (mergedNews?.length === 0) {
      console.log("I am always trying to fetch! ", mergedNews);
      localStorage.setItem("extractedKeywords", JSON.stringify([]));
      return [];
    }

    const texts: string[] = mergedNews.map((item) => {
      const title = item.title ?? "";
      const description = item.description ?? "";
      return `${title} ${description}`;
    });

    const extractedKeywords = extractTopKeywordsFromTexts(texts, limitTo);

    localStorage.setItem(
      "extractedKeywords",
      JSON.stringify(extractedKeywords)
    );

    return extractedKeywords;
  } catch (err) {
    return rejectWithValue("Failed to extract keywords");
  }
});

export const keywordsSlice = createSlice({
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
      .addCase(fetchKeywords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default keywordsSlice.reducer;
