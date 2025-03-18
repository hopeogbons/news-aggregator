import { fetchNewsApiCategories } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianCategories } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesCategories } from "../../thirdPartyAPI/news/NewYorkTimes/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { mergeRecords, sortRecords } from "../../utils";

const defaultCategories: string[] = [];

export interface CategoriesState {
  selectedCategories: string[];
  mergedCategories: string[];
  newsApiCategoriesMap: {};
  theGuardianCategoriesMap: {};
  newYorkTimesCategoriesMap: {};
  loading: boolean;
  error: string | null;
}

const selectedCategories: string[] = JSON.parse(
  localStorage.getItem("selectedCategories") || "[]"
) as string[];
const initialState: CategoriesState = {
  selectedCategories:
    selectedCategories.length > 0 ? selectedCategories : defaultCategories,
  mergedCategories: [],
  newsApiCategoriesMap: {},
  theGuardianCategoriesMap: {},
  newYorkTimesCategoriesMap: {},
  loading: false,
  error: null,
};
localStorage.setItem(
  "selectedCategories",
  JSON.stringify(initialState.selectedCategories)
);

export const fetchCategories = createAsyncThunk<
  {
    mergedCategories: string[];
    newsApiCategoriesMap: {};
    theGuardianCategoriesMap: {};
    newYorkTimesCategoriesMap: {};
  },
  void,
  { state: RootState }
>("categories/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    const { sources } = getState();
    const selectedSources: string[] = sources.selectedSources || [];

    const { newsApiCategories, newsApiCategoriesMap } =
      await fetchNewsApiCategories();
    const { theGuardianCategories, theGuardianCategoriesMap } =
      await fetchTheGuardianCategories();
    const { newYorkTimesCategories, newYorkTimesCategoriesMap } =
      await fetchNewYorkTimesCategories();

    const allCategories = {
      newsAPI: newsApiCategories,
      theGuardian: theGuardianCategories,
      newYorkTimes: newYorkTimesCategories,
    };

    const mergedCategories: string[] = sortRecords(
      Array.from(new Set(await mergeRecords(selectedSources, allCategories))),
      (a: string, b: string) => a.localeCompare(b)
    );

    return {
      mergedCategories,
      newsApiCategoriesMap,
      theGuardianCategoriesMap,
      newYorkTimesCategoriesMap,
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
      localStorage.setItem(
        "selectedCategories",
        JSON.stringify(state.selectedCategories)
      );
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
            newsApiCategoriesMap: {};
            theGuardianCategoriesMap: {};
            newYorkTimesCategoriesMap: {};
          }>
        ) => {
          state.loading = false;
          state.mergedCategories = action.payload.mergedCategories;
          state.newsApiCategoriesMap = action.payload.newsApiCategoriesMap;
          state.theGuardianCategoriesMap =
            action.payload.theGuardianCategoriesMap;
          state.newYorkTimesCategoriesMap =
            action.payload.newYorkTimesCategoriesMap;
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
