import { useEffect, useState } from "react";
import MultipleSelectChip from "./MultipleSelectChip";
import { Alert, Box, Container } from "@mui/material";
import { useRenderSkeletons } from "../decorators/useRenderSkeletons";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { updateSelectedCategories } from "../../redux/slices/categoriesSlice";

const NewsCategories = () => {
  const dispatch = useAppDispatch();
  const { mergedCategories, loading, error } = useFetchCategories();
  const selectedSources = useAppSelector(
    (state) => state.sources.selectedSources
  );
  const selectedCategories = useAppSelector(
    (state) => state.categories.selectedCategories
  );
  const [selectedData, setSelectedData] =
    useState<string[]>(selectedCategories);
  const renderSkeletons = useRenderSkeletons();

  useEffect(() => {
    setSelectedData(selectedCategories);
  }, [selectedCategories]);

  useEffect(() => {
    try {
      dispatch(updateSelectedCategories(selectedData));
    } catch (error) {
      console.error("Failed to select categories: ", error);
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

  if (!mergedCategories || mergedCategories.length === 0) {
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
      options={mergedCategories}
      selectedValues={selectedData}
      onChange={setSelectedData}
    />
  );
};

export default NewsCategories;
