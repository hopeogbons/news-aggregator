import React, { ChangeEvent, useState } from "react";
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
import QueryFilters from "./NewsFilters";
import { useFetchNews } from "../hooks/useFetchNews";

const NewsFeed = () => {
  const { mergedNews, error, loading } = useFetchNews();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNews = mergedNews.slice(startIndex, endIndex);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
            flexDirection: "row",
            alignContent: "space-between",
            gap: 2,
            mb: 4,
          }}
        >
          <QueryFilters />
        </Box>
        {paginatedNews.map((news, index) => (
          <React.Fragment key={index}>
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
          </React.Fragment>
        ))}
      </Box>

      <Box display="flex" justifyContent="center" my={6}>
        <Pagination
          variant="text"
          color="primary"
          shape="rounded"
          count={Math.ceil(mergedNews.length / itemsPerPage)}
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
