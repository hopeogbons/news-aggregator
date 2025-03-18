import { fetchNewsApiAuthors } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianAuthors } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesAuthors } from "../../thirdPartyAPI/news/NewYorkTimes/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { mergeRecords, sortRecords } from "../../utils";

export interface AuthorsState {
  mergedAuthors: string[];
  loading: boolean;
  error: string | null;
}

const mergedAuthors: string[] = JSON.parse(
  localStorage.getItem("mergedAuthors") || "[]"
) as string[];
const initialState: AuthorsState = {
  mergedAuthors: mergedAuthors.length > 0 ? mergedAuthors : [],
  loading: false,
  error: null,
};

export const fetchAuthors = createAsyncThunk<
  { mergedAuthors: string[] },
  void,
  { state: RootState }
>("authors/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    const { sources } = getState();
    const selectedSources: string[] = sources.selectedSources || [];

    const fetchPromises: Record<string, string[]> = {
      newsAPI: await fetchNewsApiAuthors(),
      theGuardian: await fetchTheGuardianAuthors(),
      newYorkTimes: await fetchNewYorkTimesAuthors(),
    };

    const mergedAuthors: string[] = sortRecords(
      Array.from(new Set(await mergeRecords(selectedSources, fetchPromises))),
      (a, b) => a.localeCompare(b)
    );

    return { mergedAuthors };
  } catch (error) {
    return rejectWithValue("Failed to fetch authors");
  }
});

const authorsSlice = createSlice({
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
        (
          state,
          action: PayloadAction<{
            mergedAuthors: string[];
          }>
        ) => {
          state.loading = false;
          state.mergedAuthors = action.payload.mergedAuthors;
        }
      )
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authorsSlice.reducer;
