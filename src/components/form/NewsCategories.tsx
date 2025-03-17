import { useEffect, useState } from "react";
import MultipleSelectChip from "./MultipleSelectChip";
import { Alert, Box, Container } from "@mui/material";
import { useRenderSkeletons } from "../decorators/useRenderSkeletons";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useAppSelector } from "../../redux/store";

const NewsCategories = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { mergedCategories, loading, error } = useFetchCategories();
  const selectedSources = useAppSelector(
    (state) => state.sources.selectedSources
  );
  const renderSkeletons = useRenderSkeletons();

  useEffect(() => {
    if (!loading && !error && mergedCategories.length > 0) {
      setSelectedCategories(mergedCategories.slice(0, 10));
    }
  }, [mergedCategories, error, loading]);

  useEffect(() => {
    if (selectedSources.length === 0) {
      setSelectedCategories([]);
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
      options={mergedCategories}
      selectedValues={selectedCategories}
      onChange={setSelectedCategories}
    />
  );
};

export default NewsCategories;
