import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchNewsAPICategories } from "../../services/NewsAPI/categories";
import { fetchTheGuardianCategories } from "../../services/TheGuardian/categories";
import { fetchNewYorkTimesCategories } from "../../services/NewYorkTimes/categories";

interface CategoryState {
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<string[], void>(
  "categories/fetch",
  async () => {
    const [newsApiCategories, theGuardianCategories, newYorkTimesCategories] =
      await Promise.all([
        fetchNewsAPICategories(),
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
  }
);

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
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export default categoriesSlice.reducer;
