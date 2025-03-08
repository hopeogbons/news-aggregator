import { FC, ReactNode } from "react";
import { Box, Container, Typography } from "@mui/material";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: FC<HomeLayoutProps> = ({ children }) => (
  <>
    <Container maxWidth="xl">
      <Box
        sx={{
          height: "10vh",
          alignContent: "center",
        }}
      >
        <Typography variant="h4">News Aggregator</Typography>
      </Box>
    </Container>

    <Container maxWidth="xl">
      <Box>{children}</Box>
    </Container>

    <Container maxWidth="xl">
      <Box
        sx={{
          height: "5vh",
          alignContent: "center",
        }}
      >
        <Typography variant="body2">&copy; News Aggregator 2025</Typography>
      </Box>
    </Container>
  </>
);

export default HomeLayout;
