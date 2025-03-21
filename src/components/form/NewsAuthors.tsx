import { useEffect, useState } from "react";
import MultipleSelectChip from "./MultipleSelectChip";
import { Alert, Box, Container } from "@mui/material";
import { useRenderSkeletons } from "../decorators/useRenderSkeletons";
import { useFetchAuthors } from "../hooks/useFetchAuthors";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { updateSelectedAuthors } from "../../redux/slices/authorsSlice";

const NewsAuthors = () => {
  const dispatch = useAppDispatch();
  const { mergedAuthors, loading, error } = useFetchAuthors();
  const selectedSources = useAppSelector(
    (state) => state.sources.selectedSources
  );
  const selectedAuthors = useAppSelector(
    (state) => state.authors.selectedAuthors
  );
  const [selectedData, setSelectedData] = useState<string[]>(selectedAuthors);
  const renderSkeletons = useRenderSkeletons();

  useEffect(() => {
    setSelectedData(selectedAuthors);
  }, [selectedAuthors]);

  useEffect(() => {
    try {
      dispatch(updateSelectedAuthors(selectedData));
    } catch (error) {
      console.error("Failed to select authors: ", error);
    }
  }, [selectedData, dispatch]);

  useEffect(() => {
    if (selectedSources.length === 0) {
      setSelectedData([]);
    }
  }, [selectedSources]);

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
        <Alert
          severity="error"
          sx={{ display: "flex", alignItems: "center", m: 0, p: 0 }}
        >
          Error: {error}
        </Alert>
      </Container>
    );
  }

  if (!mergedAuthors || mergedAuthors.length === 0) {
    return (
      <Container maxWidth="md">
        <Alert
          severity="error"
          sx={{ display: "flex", alignItems: "center", m: 0, p: 0 }}
        >
          Selecte a news source.
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
