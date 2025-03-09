import { useEffect, useLayoutEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Stack,
} from "@mui/material";
import HomeLayout from "../layouts/HomeLayout";
import FieldsetWithLegend from "../form/FieldsetWithLegend";
import MultipleSelectChip from "../form/MultipleSelectChip";
import { fetchCategories } from "../../redux/slices/categoriesSlice";
import { fetchAuthors } from "../../redux/slices/authorsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import styled from "styled-components";

const ChipSkeleton = styled(Skeleton)({
  borderRadius: "15px",
});

const HomePage = () => {
  const dispatch = useAppDispatch();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAppSelector((state) => state.categories);
  const {
    authors,
    loading: authorsLoading,
    error: authorsError,
  } = useAppSelector((state) => state.authors);

  useLayoutEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAuthors());
  }, [dispatch]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

  useEffect(() => {
    if (!categoriesLoading && !categoriesError && categories.length > 0) {
      setSelectedCategories(categories.slice(0, 10));
    }
  }, [categoriesLoading, categoriesError, categories]);

  useEffect(() => {
    if (!authorsLoading && !authorsError && categories.length > 0) {
      setSelectedAuthors(authors.slice(0, 10));
    }
  }, [authorsLoading, authorsError, authors]);

  return (
    <HomeLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          height: { xs: "inherit", md: "85vh" },
          justifyContent: "space-between",
          gap: { xs: "1.2em", md: "0.8em" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { md: "25%" },
            alignContent: "space-between",
            gap: { xs: "1.2em", md: "1em" },
          }}
        >
          <FieldsetWithLegend title="News Sources:" sx={{ p: "20px" }}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="The Guardian"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="NewsAPI"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="New York Times"
              />
              <FormControlLabel
                control={<Checkbox disabled />}
                label="BBC News"
              />
            </FormGroup>
          </FieldsetWithLegend>
          <FieldsetWithLegend title="Categories:">
            {categoriesLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignContent: "space-between",
                  flexWrap: "wrap",
                  gap: "5px",
                  p: "0.8em 0.6em",
                }}
              >
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={100}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={40}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={110}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={60}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={90}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={90}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={60}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={80}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={70}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={110}
                />
              </Box>
            ) : (
              <MultipleSelectChip
                options={categories}
                selectedValues={selectedCategories}
                onChange={setSelectedCategories}
              />
            )}
          </FieldsetWithLegend>
          <FieldsetWithLegend title="Authors:">
            {authorsLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignContent: "space-between",
                  flexWrap: "wrap",
                  gap: "5px",
                  p: "0.8em 0.6em",
                }}
              >
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={90}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={90}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={100}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={90}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={130}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={110}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={130}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={140}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={90}
                />
                <ChipSkeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  width={110}
                />
              </Box>
            ) : (
              <MultipleSelectChip
                options={authors}
                selectedValues={selectedAuthors}
                onChange={setSelectedAuthors}
              />
            )}
          </FieldsetWithLegend>
        </Box>
        <Box
          sx={{
            width: { md: "50%" },
            height: { xs: "100%", md: "auto" },
          }}
        >
          <FieldsetWithLegend title="News Feed:">
            Donal Trump
          </FieldsetWithLegend>
        </Box>
        <Box
          sx={{
            width: { md: "25%" },
          }}
        >
          <FieldsetWithLegend title="Keywords:" sx={{ p: "20px" }}>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ mt: "8px", justifyContent: "flex-start" }}
            >
              <Chip
                label="Deepseek AI"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="Donald Trump"
                variant="outlined"
                onClick={() => {}}
              />
              <Chip
                label="Chinese Warships"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="Covid 19"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="Bricks Nation"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="Super Bowl 2025"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="GPT AI"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="Deepseek AI"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="Donald Trump"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="Chinese Warships"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="Covid 19"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="Bricks Nation"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="Super Bowl 2025"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
              <Chip
                label="AI"
                variant="outlined"
                sx={{ mb: "8px !important" }}
                onClick={() => {}}
              />
            </Stack>
          </FieldsetWithLegend>
        </Box>
      </Box>
    </HomeLayout>
  );
};

export default HomePage;
