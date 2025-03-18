import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  mergeRecords,
  queryBuilder,
  sortRecords,
  validateRecords,
} from "../../utils";
import { fetchNewsApiNews } from "../../thirdPartyAPI/news/NewsAPI/api";
import { fetchTheGuardianNews } from "../../thirdPartyAPI/news/TheGuardian/api";
import { fetchNewYorkTimesNews } from "../../thirdPartyAPI/news/NewYorkTimes/api";

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  author: string;
  thumbnail: string;
  [key: string]: any;
}

export interface NewsState {
  mergedNews: NewsItem[];
  loading: boolean;
  error: string | null;
  lastKeyword: string | null;
}

export interface NewsRetrieved {
  newsPerPage: number;
  numberOfPages: number;
}

const newsRetrieved: NewsRetrieved = {
  newsPerPage: 5,
  numberOfPages: 5,
};

const savedMergedNews: NewsItem[] = JSON.parse(
  localStorage.getItem("mergedNews") || "[]"
);
const initialState: NewsState = {
  mergedNews: savedMergedNews,
  loading: false,
  error: null,
  lastKeyword: null,
};

export const fetchNews = createAsyncThunk<
  { mergedNews: NewsItem[]; keyword: string },
  string,
  { state: RootState }
>("news/fetch", async (keyword, { getState, rejectWithValue }) => {
  try {
    const sanitizedKeyword = keyword.toLowerCase().trim();
    const cachedLastKeyword: string = localStorage.getItem(
      "lastKeyword"
    ) as string;
    let mergedNews: NewsItem[] = JSON.parse(
      localStorage.getItem("mergedNews") || "[]"
    ) as NewsItem[];

    if (sanitizedKeyword !== cachedLastKeyword && mergedNews.length > 0) {
      return { mergedNews, keyword: sanitizedKeyword };
    }

    const { sources, authors, categories } = getState();
    const selectedAuthors: string[] = authors.mergedAuthors;
    const selectedCategories: string[] = categories.mergedCategories;
    const selectedSources: string[] = sources.selectedSources;

    const queryParams: string = queryBuilder(
      sanitizedKeyword,
      selectedCategories,
      selectedAuthors
    );

    const fetchPromises: Record<string, NewsItem[]> = {
      newsAPI: await fetchNewsApiNews(queryParams, newsRetrieved),
      theGuardian: await fetchTheGuardianNews(queryParams, newsRetrieved),
      newYorkTimes: await fetchNewYorkTimesNews(queryParams, newsRetrieved),
    };

    mergedNews = sortRecords(
      validateRecords(
        Array.from(new Set(await mergeRecords(selectedSources, fetchPromises))),
        (a: NewsItem) => !!a.thumbnail?.trim()
      ),
      (a: NewsItem, b: NewsItem) => {
        const fallbackDate = "1700-07-18T07:32:09+00:00"; // to deprioritize and push down
        return (
          new Date(b.publishedAt ?? fallbackDate).getTime() -
          new Date(a.publishedAt ?? fallbackDate).getTime()
        );
      }
    );

    localStorage.setItem("mergedNews", JSON.stringify(mergedNews));
    localStorage.setItem("lastKeyword", sanitizedKeyword);

    return { mergedNews, keyword: sanitizedKeyword };
  } catch (error) {
    return rejectWithValue("Failed to fetch news");
  }
});

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNews.fulfilled,
        (
          state,
          action: PayloadAction<{ mergedNews: NewsItem[]; keyword: string }>
        ) => {
          state.loading = false;
          state.mergedNews = action.payload.mergedNews;
          state.lastKeyword = action.payload.keyword;
        }
      )
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default newsSlice.reducer;
