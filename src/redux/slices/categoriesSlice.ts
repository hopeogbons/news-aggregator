import { fetchNewsApiCategories } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianCategories } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesCategories } from "../../thirdPartyAPI/news/NewYorkTimes/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface CategoriesState {
  mergedCategories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  mergedCategories: [],
  loading: false,
  error: null,
};
export const fetchCategories = createAsyncThunk<
  { mergedCategories: string[] },
  void,
  { state: RootState }
>("categories/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    const { sources } = getState();
    const selectedSources: string[] = sources.sources || [];

    const fetchPromises = new Map<string, Promise<string[]>>([
      ["newsAPI", fetchNewsApiCategories()],
      ["theGuardian", fetchTheGuardianCategories()],
      ["newYorkTimes", fetchNewYorkTimesCategories()],
    ]);

    const results = await Promise.allSettled(
      selectedSources.map((source) => fetchPromises.get(source))
    );

    const mergedCategories = Array.from(
      new Set(
        results.reduce((acc, result) => {
          if (result.status === "fulfilled" && result.value) {
            acc.push(...result.value);
          }
          return acc;
        }, [] as string[])
      )
    );

    return { mergedCategories };
  } catch (error) {
    return rejectWithValue("Failed to fetch categories");
  }
});

export const categoriesSlice = createSlice({
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

export default categoriesSlice.reducer;
