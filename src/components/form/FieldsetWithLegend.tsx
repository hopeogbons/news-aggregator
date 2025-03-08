import { Box, SxProps, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface FieldsetWithLegendProps {
  title: string;
  children?: ReactNode;
  sx?: SxProps;
}

const FieldsetWithLegend: FC<FieldsetWithLegendProps> = ({
  title,
  children,
  sx,
}) => {
  return (
    <Box
      sx={{
        ...{
          border: "solid 1px #ccc",
          borderRadius: "15px",
          p: "10px",
          position: "relative",
        },
        ...sx,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          display: "block",
          position: "absolute",
          left: "15px",
          top: { xs: "-10px", lg: "-18px" },
          backgroundColor: "#f5f3f0",
          px: "5px",
          color: "#999",
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default FieldsetWithLegend;
