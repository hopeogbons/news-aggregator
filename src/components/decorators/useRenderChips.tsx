import { useMemo } from "react";
import { Box, Chip, Tooltip } from "@mui/material";

const useRenderChips = (keywords: string[]) => {
  return useMemo(
    () =>
      keywords.map((keyword) => (
        <Tooltip
          key={keyword}
          title={keyword}
          slotProps={{ tooltip: { sx: { borderRadius: 10 } } }}
          disableInteractive
        >
          <Chip
            key={keyword}
            label={keyword}
            variant="filled"
            sx={{
              color: "#fff",
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "red",
                color: "#fff",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                borderColor: "#fff",
                cursor: "pointer",
              },
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.5)",
              whiteSpace: "nowrap",
              maxWidth: { xs: 150, lg: 300 },
              m: 0.2,
            }}
            onClick={() => {}}
          />
        </Tooltip>
      )),
    [keywords]
  );
};

export { useRenderChips };
