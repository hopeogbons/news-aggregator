import { fetchNewsApiAuthors } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianAuthors } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesAuthors } from "../../thirdPartyAPI/news/NewYorkTimes/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthorsState {
  mergedAuthors: string[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthorsState = {
  mergedAuthors: [],
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
    const selectedSources: string[] = sources.sources || [];

    const fetchPromises = new Map<string, Promise<string[]>>([
      ["newsAPI", fetchNewsApiAuthors()],
      ["theGuardian", fetchTheGuardianAuthors()],
      ["newYorkTimes", fetchNewYorkTimesAuthors()],
    ]);

    const results = await Promise.allSettled(
      selectedSources.map((source) => fetchPromises.get(source))
    );

    let merged: string[] = [];
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        merged = merged.concat(result.value);
      }
    });

    const mergedAuthors = Array.from(new Set(merged));

    return { mergedAuthors };
  } catch (error) {
    return rejectWithValue("Failed to fetch authors");
  }
});

export const authorsSlice = createSlice({
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
