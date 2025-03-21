import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getFromCache, saveToCache } from "../../utils";

export const defaultSources = ["theGuardian", "newsAPI", "newYorkTimes"];

const cachedSelectedSources = getFromCache("selectedSources", defaultSources);

export interface SourcesState {
  selectedSources: string[];
}

const initialState: SourcesState = {
  selectedSources: cachedSelectedSources,
};

const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {
    toggleSource: (state, action: PayloadAction<string>) => {
      const source = action.payload;
      if (state.selectedSources.includes(source)) {
        state.selectedSources = state.selectedSources.filter(
          (s) => s !== source
        );
      } else {
        state.selectedSources = state.selectedSources.concat(source);
      }
      saveToCache("selectedSources", state.selectedSources);
    },
  },
});

export const { toggleSource } = sourcesSlice.actions;
export default sourcesSlice.reducer;
