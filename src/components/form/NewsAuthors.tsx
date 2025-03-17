import { useEffect, useState } from "react";
import MultipleSelectChip from "./MultipleSelectChip";
import { Alert, Box, Container } from "@mui/material";
import { useRenderSkeletons } from "../decorators/useRenderSkeletons";
import { useFetchAuthors } from "../hooks/useFetchAuthors";
import { useAppSelector } from "../../redux/store";

const NewsAuthors = () => {
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const { mergedAuthors, loading, error } = useFetchAuthors();
  const selectedSources = useAppSelector(
    (state) => state.sources.selectedSources
  );
  const renderSkeletons = useRenderSkeletons();

  useEffect(() => {
    if (!loading && !error && mergedAuthors.length > 0) {
      setSelectedAuthors(mergedAuthors.slice(0, 10));
    }
  }, [mergedAuthors, error, loading]);

  useEffect(() => {
    if (selectedSources.length === 0) {
      setSelectedAuthors([]);
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
        <Alert severity="error" sx={{ display: "flex", alignItems: "center" }}>
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <MultipleSelectChip
      options={mergedAuthors}
      selectedValues={selectedAuthors}
      onChange={setSelectedAuthors}
    />
  );
};

export default NewsAuthors;
