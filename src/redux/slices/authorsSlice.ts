import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  getFromCache,
  mergeRecords,
  saveToCache,
  sortRecords,
} from "../../utils";
import { fetchNewsApiAuthors } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianAuthors } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesAuthors } from "../../thirdPartyAPI/news/NewYorkTimes/api";

export interface AuthorsState {
  selectedAuthors: string[];
  mergedAuthors: string[];
  loading: boolean;
  error: string | null;
}

const defaultAuthors: string[] = [];

const initialState: AuthorsState = {
  selectedAuthors: getFromCache("selectedAuthors", defaultAuthors),
  mergedAuthors: getFromCache("mergedAuthors", []),
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
    const fetchPromises: Record<string, Promise<string[]>> = {};

    if (selectedSources.includes("newsAPI")) {
      fetchPromises.newsAPI = fetchNewsApiAuthors();
    }
    if (selectedSources.includes("newYorkTimes")) {
      fetchPromises.newYorkTimes = fetchNewYorkTimesAuthors();
    }
    if (selectedSources.includes("theGuardian")) {
      fetchPromises.theGuardian = fetchTheGuardianAuthors();
    }

    const mergedAuthors: string[] = sortRecords(
      Array.from(new Set(await mergeRecords(fetchPromises))),
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
  reducers: {
    updateSelectedAuthors: (
      state,
      action: PayloadAction<string | string[]>
    ) => {
      state.selectedAuthors =
        typeof action.payload === "string"
          ? action.payload.split(",")
          : action.payload;
      saveToCache("selectedAuthors", state.selectedAuthors);
    },
  },
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

export const { updateSelectedAuthors } = authorsSlice.actions;
export default authorsSlice.reducer;
