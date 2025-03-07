import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e2b25",
      contrastText: "#f5f3f0",
    },
    background: {
      default: "#f5f3f0",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      [`@media (min-width:600px)`]: { fontSize: "3rem" },
      [`@media (min-width:960px)`]: { fontSize: "3.5rem" },
      [`@media (min-width:1280px)`]: { fontSize: "4rem" },
      [`@media (min-width:1920px)`]: { fontSize: "4.5rem" },
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      [`@media (min-width:600px)`]: { fontSize: "2.5rem" },
      [`@media (min-width:960px)`]: { fontSize: "3rem" },
      [`@media (min-width:1280px)`]: { fontSize: "3.5rem" },
      [`@media (min-width:1920px)`]: { fontSize: "4rem" },
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      [`@media (min-width:600px)`]: { fontSize: "2rem" },
      [`@media (min-width:960px)`]: { fontSize: "2.5rem" },
      [`@media (min-width:1280px)`]: { fontSize: "3rem" },
      [`@media (min-width:1920px)`]: { fontSize: "3.5rem" },
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      [`@media (min-width:600px)`]: { fontSize: "1.75rem" },
      [`@media (min-width:960px)`]: { fontSize: "2rem" },
      [`@media (min-width:1280px)`]: { fontSize: "2.25rem" },
      [`@media (min-width:1920px)`]: { fontSize: "2.5rem" },
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 400,
      [`@media (min-width:600px)`]: { fontSize: "1.5rem" },
      [`@media (min-width:960px)`]: { fontSize: "1.75rem" },
      [`@media (min-width:1280px)`]: { fontSize: "2rem" },
      [`@media (min-width:1920px)`]: { fontSize: "2.25rem" },
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 400,
      [`@media (min-width:600px)`]: { fontSize: "1.25rem" },
      [`@media (min-width:960px)`]: { fontSize: "1.5rem" },
      [`@media (min-width:1280px)`]: { fontSize: "1.75rem" },
      [`@media (min-width:1920px)`]: { fontSize: "2rem" },
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.5,
      [`@media (min-width:600px)`]: { fontSize: "1rem" },
      [`@media (min-width:960px)`]: { fontSize: "1.125rem" },
      [`@media (min-width:1280px)`]: { fontSize: "1.25rem" },
      [`@media (min-width:1920px)`]: { fontSize: "1.375rem" },
    },
    body2: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.5,
      [`@media (min-width:600px)`]: { fontSize: "0.875rem" },
      [`@media (min-width:960px)`]: { fontSize: "1rem" },
      [`@media (min-width:1280px)`]: { fontSize: "1.125rem" },
      [`@media (min-width:1920px)`]: { fontSize: "1.25rem" },
    },
    caption: {
      fontSize: "0.625rem",
      fontWeight: 400,
      lineHeight: 1.25,
      [`@media (min-width:600px)`]: { fontSize: "0.75rem" },
      [`@media (min-width:960px)`]: { fontSize: "0.875rem" },
      [`@media (min-width:1280px)`]: { fontSize: "1rem" },
    },
    overline: {
      fontSize: "0.625rem",
      fontWeight: 600,
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      [`@media (min-width:600px)`]: { fontSize: "0.75rem" },
      [`@media (min-width:960px)`]: { fontSize: "0.875rem" },
      [`@media (min-width:1280px)`]: { fontSize: "1rem" },
    },
  },
});

export { theme };
