import { combineReducers } from "@reduxjs/toolkit";
import categoriesReducer from "./slices/categoriesSlice";
import authorsReducer from "./slices/authorsSlice";

const rootReducer = combineReducers({
  categories: categoriesReducer,
  authors: authorsReducer,
});

export default rootReducer;
