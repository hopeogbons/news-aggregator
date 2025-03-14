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
          border: "solid 1px",
          borderColor: "#CCC",
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
          backgroundColor: "background.default",
          px: "5px",
          fontWeight: "700",
          color: "secondary.main",
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default FieldsetWithLegend;
