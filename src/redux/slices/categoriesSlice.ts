import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AsyncThunk,
  SliceSelectors,
  Slice,
} from "@reduxjs/toolkit";
import { fetchNewsApiCategories } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianCategories } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesCategories } from "../../thirdPartyAPI/news/NewYorkTimes/api";

interface CategoriesState {
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories: AsyncThunk<string[], void, any> =
  createAsyncThunk<string[], void>("categories/fetch", async () => {
    const [newsApiCategories, theGuardianCategories, newYorkTimesCategories]: [
      string[],
      string[],
      string[]
    ] = await Promise.all([
      fetchNewsApiCategories(),
      fetchTheGuardianCategories(),
      fetchNewYorkTimesCategories(),
    ]);

    const allCategories: string[] = [
      ...newsApiCategories,
      ...theGuardianCategories,
      ...newYorkTimesCategories,
    ];

    const uniqueCategories: string[] = Array.from(new Set(allCategories));
    const sortedCategories: string[] = uniqueCategories.sort(
      (a: string, b: string) => a.localeCompare(b)
    );

    return sortedCategories;
  });

const categoriesSlice: Slice<
  CategoriesState,
  {},
  "categories",
  "categories",
  SliceSelectors<CategoriesState>
> = createSlice({
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
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch categories";
      });
  },
});

export type { CategoriesState };
export default categoriesSlice.reducer;
