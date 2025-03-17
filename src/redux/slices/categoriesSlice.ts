import { fetchNewsApiCategories } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianCategories } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesCategories } from "../../thirdPartyAPI/news/NewYorkTimes/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { mergeRecords, sortRecords } from "../../utils";

export interface CategoriesState {
  mergedCategories: string[];
  newsApiCategoriesMap: {};
  theGuardianCategoriesMap: {};
  newYorkTimesCategoriesMap: {};
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  mergedCategories: [],
  newsApiCategoriesMap: {},
  theGuardianCategoriesMap: {},
  newYorkTimesCategoriesMap: {},
  loading: false,
  error: null,
};

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
  reducers: {},
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

export default categoriesSlice.reducer;
