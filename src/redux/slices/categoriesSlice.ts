import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  getFromCache,
  mergeRecords,
  saveToCache,
  sortRecords,
} from "../../utils";
import { fetchNewsApiCategories } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianCategories } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesCategories } from "../../thirdPartyAPI/news/NewYorkTimes/api";

export interface CategoriesState {
  selectedCategories: string[];
  mergedCategories: string[];
  loading: boolean;
  error: string | null;
}

const defaultCategories: string[] = [];

const initialState: CategoriesState = {
  selectedCategories: getFromCache("selectedCategories", defaultCategories),
  mergedCategories: getFromCache("mergedCategories", []),
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<
  {
    mergedCategories: string[];
  },
  void,
  { state: RootState }
>("categories/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    const { sources } = getState();
    const selectedSources: string[] = sources.selectedSources || [];
    const fetchPromises: Record<string, Promise<string[]>> = {};

    if (selectedSources.includes("newsAPI")) {
      fetchPromises.newsAPI = fetchNewsApiCategories();
    }
    if (selectedSources.includes("newYorkTimes")) {
      fetchPromises.newYorkTimes = fetchNewYorkTimesCategories();
    }
    if (selectedSources.includes("theGuardian")) {
      fetchPromises.theGuardian = fetchTheGuardianCategories();
    }

    const mergedCategories: string[] = sortRecords(
      Array.from(new Set(await mergeRecords(fetchPromises))),
      (a: string, b: string) => a.localeCompare(b)
    );

    return {
      mergedCategories,
    };
  } catch (error) {
    return rejectWithValue("Failed to fetch categories");
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    updateSelectedCategories: (
      state,
      action: PayloadAction<string | string[]>
    ) => {
      state.selectedCategories =
        typeof action.payload === "string"
          ? action.payload.split(",")
          : action.payload;
      saveToCache("selectedCategories", state.selectedCategories);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (
          state,
          action: PayloadAction<{
            mergedCategories: string[];
          }>
        ) => {
          state.loading = false;
          state.mergedCategories = action.payload.mergedCategories;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateSelectedCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
