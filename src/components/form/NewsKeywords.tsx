import { Alert, Box, Container } from "@mui/material";
import { useRenderSkeletons } from "../decorators/useRenderSkeletons";
import { useFetchKeywords } from "../hooks/useFetchKeywords";
import { useRenderChips } from "../decorators/useRenderChips";
import { useEffect, useState } from "react";

const NewsKeywords = () => {
  const [keywordChips, setKeywordChips] = useState<string[]>([]);
  const { keywords, loading, error } = useFetchKeywords();
  const renderSkeletons = useRenderSkeletons();
  const renderChips = useRenderChips(keywordChips);

  useEffect(() => {
    if (!loading && !error && keywords.length > 0) {
      setKeywordChips(keywords);
    }
  }, [keywords, error, loading]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {renderSkeletons}
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert
          severity="error"
          sx={{ my: 3, display: "flex", alignItems: "center" }}
        >
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return renderChips;
};

export default NewsKeywords;
