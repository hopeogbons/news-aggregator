import { FC } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Tooltip } from "@mui/material";
import { useAppDispatch } from "../../redux/store";
import { updateSelectedCategories } from "../../redux/slices/categoriesSlice";

interface MultipleSelectChipProps {
  options: string[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
}

const getStyles = (
  name: string,
  selectedValues: readonly string[],
  theme: Theme
) => {
  return {
    fontWeight: selectedValues.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
};

const MultipleSelectChip: FC<MultipleSelectChipProps> = ({
  options,
  selectedValues,
  onChange,
}) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const { value } = event.target;
    dispatch(updateSelectedCategories(value));
    const newSelectedValues =
      typeof value === "string" ? value.split(",") : value;
    onChange(newSelectedValues);
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        labelId="multiple-chip-label"
        id="multiple-chip"
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Tooltip
                key={value}
                title={value}
                slotProps={{
                  tooltip: { sx: { borderRadius: 10 } },
                }}
                disableInteractive
              >
                <Chip
                  key={value}
                  label={value}
                  variant="filled"
                  color="primary"
                  sx={{
                    maxWidth: { xs: 200, lg: 280 },
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.5)",
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        )}
        sx={{
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": { border: "0 !important" },
          ".MuiOutlinedInput-notchedOutline:focus": { border: "0 !important" },
          p: "0px !important",
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            style={getStyles(option, selectedValues, theme)}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultipleSelectChip;
