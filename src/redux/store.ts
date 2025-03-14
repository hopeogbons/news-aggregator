import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authorsReducer from "./slices/authorsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import keywordsReducer from "./slices/keywordsSlice";
import newsReducer from "./slices/newsSlice";
import sourcesReducer from "./slices/sourcesSlice";

const store = configureStore({
  reducer: {
    authors: authorsReducer,
    categories: categoriesReducer,
    keywords: keywordsReducer,
    news: newsReducer,
    sources: sourcesReducer,
  },
});

type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
