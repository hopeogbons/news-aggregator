import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Typography,
  Pagination,
  Container,
  CircularProgress,
  Alert,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import { formatDate } from "../../utils";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import NewsFilters from "./NewsFilters";
import { useFetchNews } from "../hooks/useFetchNews";
import { filterNewsArticles } from "../../utils";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const NewsFeed = () => {
  const { mergedNews, error, loading } = useFetchNews();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  type FilterState = {
    date: dayjs.Dayjs | null;
    category: string;
    source: string;
  };

  const [filters, setFilters] = useState<FilterState>({
    date: null,
    category: "",
    source: "",
  });

  const handleFilterChange = (newsFilter: Partial<FilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newsFilter };
      const hasChanged = Object.keys(updated).some(
        (key) =>
          updated[key as keyof FilterState] !== prev[key as keyof FilterState]
      );
      return hasChanged ? updated : prev;
    });
  };

  const filteredMergedNews = useMemo(() => {
    return filterNewsArticles(
      mergedNews,
      filters.category ? [filters.category] : [],
      [],
      filters.source ? [filters.source] : [],
      filters.date ? filters.date.format("YYYY-MM-DD") : null
    );
  }, [mergedNews, filters]);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNews = filteredMergedNews.slice(startIndex, endIndex);

  useEffect(() => {
    const pageCount = Math.ceil(filteredMergedNews.length / itemsPerPage);
    if (page > pageCount) setPage(Math.max(1, pageCount));
  }, [filteredMergedNews, page, itemsPerPage]);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    console.log(event);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
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

  if (!mergedNews || mergedNews.length === 0) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ display: "flex", alignItems: "center" }}>
          No news available.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignContent: "space-between",
            gap: 2,
            mb: 4,
          }}
        >
          <NewsFilters filters={filters} onFilterChange={handleFilterChange} />
        </Box>
        {paginatedNews.map((news, index) => (
          <Box key={index}>
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignContent: "flex-end",
                  gap: { xs: 1.8, md: 3 },
                }}
              >
                {news.thumbnail && (
                  <Avatar
                    src={news.thumbnail}
                    variant="rounded"
                    sx={{
                      width: { xs: 120, md: 150 },
                      height: { xs: 90, md: 120 },
                      objectFit: "cover",
                      color: "primary.main",
                      backgroundColor: "background.default",
                      boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.7)",
                      borderRadius: 2,
                      transform:
                        index % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)",
                    }}
                  />
                )}

                <Box sx={{ flex: 1, alignSelf: "center" }}>
                  <Typography
                    variant="caption"
                    sx={{
                      background:
                        "linear-gradient(45deg, #ccc 10%, #0096FF 90%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "bold",
                      display: "flex",
                      lineHeight: 1,
                      fontSize: "0.7em !important",
                    }}
                  >
                    {news.source}
                    <Box
                      component="span"
                      sx={{
                        p: { xs: "0px 10px", md: "0px 15px" },
                      }}
                    >
                      <KeyboardArrowRightIcon
                        sx={{ fontSize: "1em", color: "#999" }}
                      />
                    </Box>
                    {news.category}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.primary",
                      fontWeight: 550,
                      mb: 1,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: { xs: 4, md: 3 },
                      lineHeight: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {news.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      background: "linear-gradient(45deg, #ccc 10%, red 90%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "bold",
                      mb: 0.5,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      lineHeight: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "0.7em !important",
                    }}
                  >
                    {formatDate(news.publishedAt)}
                    <span
                      style={{
                        padding: "0px 15px",
                      }}
                    >
                      |
                    </span>
                    {`by ${news.author}`}
                  </Typography>
                </Box>
              </Box>
            </a>

            {index < paginatedNews.length - 1 && (
              <Divider variant="middle" sx={{ my: { xs: 2, md: 3.5 } }} />
            )}
          </Box>
        ))}
      </Box>

      <Box display="flex" justifyContent="center" my={6}>
        <Pagination
          variant="text"
          color="primary"
          shape="rounded"
          count={Math.ceil(filteredMergedNews.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          boundaryCount={1}
          siblingCount={1}
        />
      </Box>
    </Container>
  );
};

export default NewsFeed;
