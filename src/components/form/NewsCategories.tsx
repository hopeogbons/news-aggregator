import { useEffect, useState } from "react";
import MultipleSelectChip from "./MultipleSelectChip";
import { Alert, Box, Container } from "@mui/material";
import { useRenderSkeletons } from "../decorators/useRenderSkeletons";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { updateSelectedCategories } from "../../redux/slices/categoriesSlice";

const NewsCategories = () => {
  const dispatch = useAppDispatch();
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const { mergedCategories, loading, error } = useFetchCategories();
  const selectedSources = useAppSelector(
    (state) => state.sources.selectedSources
  );
  const selectedCategories = useAppSelector(
    (state) => state.categories.selectedCategories
  );
  const renderSkeletons = useRenderSkeletons();

  useEffect(() => {
    if (!loading && !error && mergedCategories.length > 0) {
      setSelectedData(selectedCategories);
    }
  }, [mergedCategories, error, loading]);

  useEffect(() => {
    if (selectedSources.length === 0) {
      setSelectedData([]);
    }
  }, [selectedSources]);

  useEffect(() => {
    if (selectedData.length > 0) {
      dispatch(updateSelectedCategories(selectedData));
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
      options={mergedCategories}
      selectedValues={selectedData}
      onChange={setSelectedData}
    />
  );
};

export default NewsCategories;
