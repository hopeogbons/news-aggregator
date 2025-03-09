import { useLayoutEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import HomeLayout from "../layouts/HomeLayout";
import FieldsetWithLegend from "../form/FieldsetWithLegend";
import MultipleSelectChip from "../form/MultipleSelectChip";
import { fetchCategories } from "../../redux/slices/categoriesSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);

  useLayoutEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "books",
    "climate",
    "education",
    "entertainment",
    "health",
    "politics",
    "science",
    "sports",
    "technology",
    "travel",
    "weather",
    "world",
  ]);
  const allAuthors = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

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
            <MultipleSelectChip
              options={categories}
              selectedValues={selectedCategories}
              onChange={setSelectedCategories}
            />
          </FieldsetWithLegend>
          <FieldsetWithLegend title="Authors:">
            <MultipleSelectChip
              options={allAuthors}
              selectedValues={selectedAuthors}
              onChange={setSelectedAuthors}
            />
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
