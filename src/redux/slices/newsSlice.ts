import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  extractTopKeywordsFromTexts,
  getFromCache,
  mergeRecords,
  saveToCache,
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

export interface NewsRetrieved {
  newsPerPage: number;
  numberOfPages: number;
}
const newsRetrieved: NewsRetrieved = {
  newsPerPage: 5,
  numberOfPages: 5,
};

const limitTo: number = 10;
const cachedMergedNews = getFromCache("mergedNews", []);
const cachedLastKeyword = getFromCache("lastKeyword", "");
const cachedExtractedKeywords = getFromCache("extractedKeywords", []);

export interface NewsState {
  lastKeyword: string;
  extractedKeywords: string[];
  mergedNews: NewsItem[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  lastKeyword: cachedLastKeyword,
  extractedKeywords: cachedExtractedKeywords,
  mergedNews: cachedMergedNews,
  loading: false,
  error: null,
};

export const fetchNews = createAsyncThunk<
  { mergedNews: NewsItem[]; keyword: string; extractedKeywords: string[] },
  string,
  { state: RootState }
>("news/fetch", async (keyword, { getState, rejectWithValue }) => {
  try {
    const incomingKeyword = keyword.toLowerCase().trim();

    if (incomingKeyword === cachedLastKeyword) {
      return {
        mergedNews: cachedMergedNews,
        keyword: cachedLastKeyword,
        extractedKeywords: cachedExtractedKeywords,
      };
    }

    const { sources } = getState();
    const selectedSources: string[] = sources.selectedSources;
    const fetchPromises: Record<string, Promise<NewsItem[]>> = {};

    if (selectedSources.includes("newsAPI")) {
      fetchPromises.newsAPI = fetchNewsApiNews(incomingKeyword, newsRetrieved);
    }
    if (selectedSources.includes("newYorkTimes")) {
      fetchPromises.newYorkTimes = fetchNewYorkTimesNews(
        incomingKeyword,
        newsRetrieved
      );
    }
    if (selectedSources.includes("theGuardian")) {
      fetchPromises.theGuardian = fetchTheGuardianNews(
        incomingKeyword,
        newsRetrieved
      );
    }

    const mergedNews = sortRecords(
      validateRecords(
        await mergeRecords(fetchPromises),
        (a: NewsItem) => !!a.thumbnail?.trim()
      ),
      (a: NewsItem, b: NewsItem) => {
        const fallbackDate = "1700-07-18T07:32:09+00:00"; // to deprioritize and push down
        return (
          new Date(b.publishedAt || fallbackDate).getTime() -
          new Date(a.publishedAt || fallbackDate).getTime()
        );
      }
    );

    const extractedKeywords: string[] = extractTopKeywordsFromTexts(
      mergedNews,
      limitTo
    );

    saveToCache("mergedNews", mergedNews);
    saveToCache("lastKeyword", incomingKeyword);
    saveToCache("extractedKeywords", extractedKeywords);

    return { mergedNews, keyword: incomingKeyword, extractedKeywords };
  } catch (error) {
    return rejectWithValue("Failed to fetch combined news");
  }
});

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    search: (state, action: PayloadAction<string>) => {
      state.lastKeyword = action.payload;
      saveToCache("lastKeyword", state.lastKeyword);
    },
  },
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
          action: PayloadAction<{
            mergedNews: NewsItem[];
            keyword: string;
            extractedKeywords: string[];
          }>
        ) => {
          state.loading = false;
          state.mergedNews = action.payload.mergedNews;
          state.lastKeyword = action.payload.keyword;
          state.extractedKeywords = action.payload.extractedKeywords;
        }
      )
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { search } = newsSlice.actions;
export default newsSlice.reducer;
