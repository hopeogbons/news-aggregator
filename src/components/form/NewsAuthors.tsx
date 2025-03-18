import { useEffect, useState } from "react";
import MultipleSelectChip from "./MultipleSelectChip";
import { Alert, Box, Container } from "@mui/material";
import { useRenderSkeletons } from "../decorators/useRenderSkeletons";
import { useFetchAuthors } from "../hooks/useFetchAuthors";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { updateSelectedAuthors } from "../../redux/slices/authorsSlice";

const NewsAuthors = () => {
  const dispatch = useAppDispatch();
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const { mergedAuthors, loading, error } = useFetchAuthors();
  const selectedSources = useAppSelector(
    (state) => state.sources.selectedSources
  );
  const selectedAuthors = useAppSelector(
    (state) => state.authors.selectedAuthors
  );
  const renderSkeletons = useRenderSkeletons();

  useEffect(() => {
    if (!loading && !error && mergedAuthors.length > 0) {
      setSelectedData(selectedAuthors);
    }
  }, [mergedAuthors, error, loading]);

  useEffect(() => {
    if (selectedSources.length === 0) {
      setSelectedData([]);
    }
  }, [selectedSources]);

  useEffect(() => {
    if (selectedData.length > 0) {
      dispatch(updateSelectedAuthors(selectedData));
    }
  }, [selectedData]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          p: "0.8em 0.6em",
        }}
      >
        {renderSkeletons}
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ display: "flex", alignItems: "center" }}>
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <MultipleSelectChip
      options={mergedAuthors}
      selectedValues={selectedData}
      onChange={setSelectedData}
    />
  );
};

export default NewsAuthors;
