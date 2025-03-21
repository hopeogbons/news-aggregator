import { Alert, Box, Container } from "@mui/material";
import { useRenderSkeletons } from "../decorators/useRenderSkeletons";
import { useRenderChips } from "../decorators/useRenderChips";
import { useEffect, useState } from "react";
import { useFetchNews } from "../hooks/useFetchNews";

const NewsKeywords = () => {
  const [keywordChips, setKeywordChips] = useState<string[]>([]);
  const { extractedKeywords, loading, error } = useFetchNews();
  const renderSkeletons = useRenderSkeletons();
  const renderChips = useRenderChips(keywordChips);

  useEffect(() => {
    if (!loading && !error && extractedKeywords.length > 0) {
      setKeywordChips(extractedKeywords);
    }
  }, [extractedKeywords, error, loading]);

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
          sx={{ my: 3, display: "flex", alignItems: "center", m: 0, p: 0 }}
        >
          Error: {error}
        </Alert>
      </Container>
    );
  }

  if (!extractedKeywords || extractedKeywords.length === 0) {
    return (
      <Container maxWidth="md">
        <Alert
          severity="error"
          sx={{ display: "flex", alignItems: "center", m: 0, p: 0 }}
        >
          Search for news.
        </Alert>
      </Container>
    );
  }

  return renderChips;
};

export default NewsKeywords;
