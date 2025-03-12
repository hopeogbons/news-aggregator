import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const defaultSources = ["theGuardian", "newsAPI", "newYorkTimes"];

export interface SourcesState {
  sources: string[];
}

const savedSources: string[] | null = JSON.parse(
  localStorage.getItem("sources") || "null"
);

const initialState: SourcesState = {
  sources: savedSources !== null ? savedSources : defaultSources,
};
localStorage.setItem("sources", JSON.stringify(initialState.sources));

const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {
    toggleSource: (state, action: PayloadAction<string>) => {
      if (state.sources.includes(action.payload)) {
        state.sources = state.sources.filter(
          (source) => source !== action.payload
        );
      } else {
        state.sources.push(action.payload);
      }
      localStorage.setItem("sources", JSON.stringify(state.sources));
    },
  },
});

export const { toggleSource } = sourcesSlice.actions;
export default sourcesSlice.reducer;
