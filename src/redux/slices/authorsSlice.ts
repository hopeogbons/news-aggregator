import { fetchNewsApiAuthors } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianAuthors } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesAuthors } from "../../thirdPartyAPI/news/NewYorkTimes/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { mergeRecords, sortRecords } from "../../utils";

const defaultAuthors: string[] = [];

export interface AuthorsState {
  selectedAuthors: string[];
  mergedAuthors: string[];
  loading: boolean;
  error: string | null;
}

const mergedAuthors: string[] = JSON.parse(
  localStorage.getItem("mergedAuthors") || "[]"
) as string[];
const selectedAuthors: string[] = JSON.parse(
  localStorage.getItem("selectedAuthors") || "[]"
) as string[];
const initialState: AuthorsState = {
  selectedAuthors:
    selectedAuthors.length > 0 ? selectedAuthors : defaultAuthors,
  mergedAuthors: mergedAuthors.length > 0 ? mergedAuthors : [],
  loading: false,
  error: null,
};
localStorage.setItem(
  "selectedAuthors",
  JSON.stringify(initialState.selectedAuthors)
);

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
  reducers: {
    updateSelectedAuthors: (
      state,
      action: PayloadAction<string | string[]>
    ) => {
      state.selectedAuthors =
        typeof action.payload === "string"
          ? action.payload.split(",")
          : action.payload;
      localStorage.setItem(
        "selectedAuthors",
        JSON.stringify(state.selectedAuthors)
      );
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
