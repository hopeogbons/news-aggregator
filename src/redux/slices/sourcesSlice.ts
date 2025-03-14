import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export const defaultSources = ["theGuardian", "newsAPI", "newYorkTimes"];
export interface SourcesState {
  selectedSources: string[];
}

const savedSources: string[] | null = JSON.parse(
  localStorage.getItem("selectedSources") || "null"
);
const initialState: SourcesState = {
  selectedSources: savedSources !== null ? savedSources : defaultSources,
};
localStorage.setItem(
  "selectedSources",
  JSON.stringify(initialState.selectedSources)
);

const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {
    toggleSource: (state, action: PayloadAction<string>) => {
      if (state.selectedSources.includes(action.payload)) {
        state.selectedSources = state.selectedSources.filter(
          (source) => source !== action.payload
        );
      } else {
        state.selectedSources.push(action.payload);
      }
      localStorage.setItem(
        "selectedSources",
        JSON.stringify(state.selectedSources)
      );
    },
  },
});

export const { toggleSource } = sourcesSlice.actions;
export default sourcesSlice.reducer;
