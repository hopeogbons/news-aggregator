import { useMemo } from "react";
import { Skeleton } from "@mui/material";

const SKELETON_WIDTHS = [100, 40, 110, 60, 90, 90, 60, 80, 70, 110];

const useRenderSkeletons = () => {
  return useMemo(
    () =>
      SKELETON_WIDTHS.map((width, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          animation="wave"
          height={30}
          width={width}
          sx={{ borderRadius: "15px" }}
        />
      )),
    []
  );
};

export { useRenderSkeletons };
