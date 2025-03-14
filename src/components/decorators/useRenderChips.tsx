import { useMemo } from "react";
import { Chip, Tooltip } from "@mui/material";

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
            variant="outlined"
            sx={{
              mb: "8px !important",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: { xs: 150, lg: 300 },
            }}
            onClick={() => {}}
          />
        </Tooltip>
      )),
    [keywords]
  );
};

export { useRenderChips };
