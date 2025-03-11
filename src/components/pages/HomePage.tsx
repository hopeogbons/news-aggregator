import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Stack,
  Tooltip,
} from "@mui/material";
import HomeLayout from "../layouts/HomeLayout";
import FieldsetWithLegend from "../form/FieldsetWithLegend";
import MultipleSelectChip from "../form/MultipleSelectChip";
import { fetchCategories } from "../../redux/slices/categoriesSlice";
import { fetchAuthors } from "../../redux/slices/authorsSlice";
import { fetchKeywords } from "../../redux/slices/keywordsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const SKELETON_WIDTHS = [100, 40, 110, 60, 90, 90, 60, 80, 70, 110];

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
  const {
    keywords,
    loading: keywordsLoading,
  } = useAppSelector((state) => state.keywords);

  useLayoutEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAuthors());
    dispatch(fetchKeywords());
  }, [dispatch]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

  useEffect(() => {
    if (!categoriesLoading && !categoriesError && categories.length > 0) {
      setSelectedCategories(categories.slice(0, 10));
    }
  }, [categoriesLoading, categoriesError, categories]);

  useEffect(() => {
    if (!authorsLoading && !authorsError && authors.length > 0) {
      setSelectedAuthors(authors.slice(0, 10));
    }
  }, [authorsLoading, authorsError, authors]);

  const renderSkeletons = useMemo(
    () => () =>
      SKELETON_WIDTHS.map((width, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          animation="wave"
          height={30}
          width={width}
          sx={{ borderRadius: "15px" }}
        />
      )),
    []
  );

  const keywordChips = useMemo(
    () =>
      keywords.map((keyword) => (
        <Tooltip
          key={keyword}
          title={keyword}
          slotProps={{ tooltip: { sx: { borderRadius: 10 } } }}
          disableInteractive
        >
          <Chip
            key={keyword}
            label={keyword}
            variant="outlined"
            sx={{
              mb: "8px !important",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: { xs: 150, lg: 300 },
            }}
            onClick={() => {}}
          />
        </Tooltip>
      )),
    [keywords]
  );

  return (
    <HomeLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          justifyContent: "space-between",
          gap: { xs: "1.2em", md: "0.8em" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { md: "25%" },
            gap: { xs: "1.2em", md: "1em" },
          }}
        >
          <FieldsetWithLegend title="News Sources:" sx={{ p: "20px" }}>
            <FormGroup>
              {["The Guardian", "NewsAPI", "New York Times"].map((source) => (
              <FormControlLabel
                  key={source}
                control={<Checkbox defaultChecked />}
                  label={source}
                  name={source.toLowerCase().replace(" ", "")}
                />
              ))}
              <FormControlLabel
                control={<Checkbox disabled />}
                label="BBC News"
                name="bbcnews"
              />
            </FormGroup>
          </FieldsetWithLegend>

          <FieldsetWithLegend title="Categories:">
            {categoriesLoading ? (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  p: "0.8em 0.6em",
                }}
              >
                {renderSkeletons()}
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
                  flexWrap: "wrap",
                  gap: "5px",
                  p: "0.8em 0.6em",
                }}
              >
                {renderSkeletons()}
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

        <Box sx={{ width: { md: "50%" } }}>
          <FieldsetWithLegend title="News Feed:">
            Donald Trump
          </FieldsetWithLegend>
        </Box>

        <Box sx={{ width: { md: "25%" } }}>
          <FieldsetWithLegend title="Keywords:" sx={{ p: "20px" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {keywordsLoading ? (
                renderSkeletons()
            ) : (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
                  sx={{ mt: "8px" }}
            >
                  {keywordChips}
            </Stack>
            )}
            </Box>
          </FieldsetWithLegend>
        </Box>
      </Box>
    </HomeLayout>
  );
};

export default HomePage;
