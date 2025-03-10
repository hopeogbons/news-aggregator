import { combineReducers } from "@reduxjs/toolkit";
import categoriesReducer from "./slices/categoriesSlice";
import authorsReducer from "./slices/authorsSlice";
import keywordsReducer from "./slices/keywordsSlice";

const rootReducer = combineReducers({
  categories: categoriesReducer,
  authors: authorsReducer,
  keywords: keywordsReducer,
});

export default rootReducer;
