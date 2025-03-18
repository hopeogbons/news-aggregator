import { FC, ReactNode } from "react";
import { Box, Container, Typography } from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SearchKeywords from "../form/KeywordsSearch";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: FC<HomeLayoutProps> = ({ children }) => (
  <>
    <Container
      sx={{
        backgroundColor: "primary.main",
        mb: { xs: 4, md: 8 },
        borderBottom: "solid 1px #333",
        boxShadow: "0 5px 15px -2px rgba(0, 0, 0, 0.5)",
      }}
      maxWidth={false}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          py: 6,
        }}
      >
        <Box
          sx={{
            alignContent: "center",
            justifySelf: { xs: "center", md: "flex-start" },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 1200,
              color: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            <NewspaperIcon
              sx={{
                mr: 2,
                fontSize: { xs: 30, md: 65 },
              }}
            />
            News updates
          </Typography>
        </Box>
        <Box sx={{ alignSelf: "start-end" }}>
          <SearchKeywords />
        </Box>
      </Container>
    </Container>

    <Container maxWidth="xl">
      <Box>{children}</Box>
    </Container>

    <Container maxWidth="xl">
      <Box
        sx={{
          py: 5,
          alignContent: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>
            &copy; Copyright 2025 | <b>News Aggregator.</b>
          </span>
          <span style={{ fontSize: "12px", color: "#AAA" }}>
            by Hope Ogbons (with{" "}
            <span style={{ color: "red", paddingRight: "3px" }}>&hearts;</span>
            +2348033644880)
          </span>
        </Typography>
      </Box>
    </Container>
  </>
);

export default HomeLayout;
