import { Box } from "@mui/material";
import HomeLayout from "../layouts/HomeLayout";
import FieldsetWithLegend from "../form/FieldsetWithLegend";
import NewsSources from "../form/NewsSources";
import NewsCategories from "../form/NewsCategories";
import NewsAuthors from "../form/NewsAuthors";
import NewsKeywords from "../form/NewsKeywords";
import NewsFeed from "../form/NewsFeed";

const HomePage = () => {
  return (
    <HomeLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          justifyContent: "space-between",
          gap: { xs: "1em", md: "0.4em" },
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
            <NewsSources />
          </FieldsetWithLegend>

          <FieldsetWithLegend title="Categories:">
            <NewsCategories />
          </FieldsetWithLegend>

          <FieldsetWithLegend title="Authors:">
            <NewsAuthors />
          </FieldsetWithLegend>
        </Box>

        <Box sx={{ width: { md: "50%", p: 0 } }}>
          <NewsFeed />
        </Box>

        <Box sx={{ width: { md: "25%" } }}>
          <FieldsetWithLegend title="Keywords:" sx={{ p: "20px", mb: 2 }}>
            <NewsKeywords />
          </FieldsetWithLegend>
        </Box>
      </Box>
    </HomeLayout>
  );
};

export default HomePage;
